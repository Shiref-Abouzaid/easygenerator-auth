import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';
import { requestLogger } from './common/middleware/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(requestLogger);
  setupApp(app);
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Auth Module API')
    .setDescription('Sign up, sign in and a protected profile endpoint.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup(
    'api/docs',
    app,
    SwaggerModule.createDocument(app, swaggerConfig),
  );

  const config = app.get(ConfigService);
  await app.listen(config.get<number>('PORT') ?? 3000);
}
void bootstrap();
