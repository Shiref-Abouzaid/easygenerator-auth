import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  app.enableShutdownHooks();

  const config = app.get(ConfigService);
  await app.listen(config.get<number>('PORT') ?? 3000);
}
void bootstrap();