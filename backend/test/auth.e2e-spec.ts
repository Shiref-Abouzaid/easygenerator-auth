import { ConflictException, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { setupApp } from '../src/app.setup';
import { AuthModule } from '../src/auth/auth.module';
import { User } from '../src/users/schemas/user.schema';
import { UsersService } from '../src/users/users.service';

/** In-memory stand-in for the MongoDB-backed users service. */
class InMemoryUsersService {
  private users: {
    _id: string;
    email: string;
    name: string;
    passwordHash: string;
  }[] = [];

  create(data: { email: string; name: string; passwordHash: string }) {
    const email = data.email.toLowerCase();
    if (this.users.some((user) => user.email === email)) {
      throw new ConflictException({
        message: 'Email is already registered.',
        errors: [{ field: 'email', message: 'Email is already registered.' }],
      });
    }
    const user = { ...data, email, _id: String(this.users.length + 1) };
    this.users.push(user);
    return user;
  }

  findByEmailWithPassword(email: string) {
    return (
      this.users.find((user) => user.email === email.toLowerCase()) ?? null
    );
  }

  findById(id: string) {
    return this.users.find((user) => user._id === id) ?? null;
  }

  toPublic(user: { _id: string; email: string; name: string }) {
    return { id: user._id, email: user.email, name: user.name };
  }
}

describe('Auth flow (e2e)', () => {
  let app: INestApplication<App>;
  const credentials = { email: 'sam@example.com', password: 'Passw0rd!' };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              JWT_SECRET: 'test-secret',
              JWT_EXPIRES_IN_SECONDS: '3600',
              CORS_ORIGIN: 'http://localhost:5173',
            }),
          ],
        }),
        AuthModule,
      ],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .overrideProvider(UsersService)
      .useClass(InMemoryUsersService)
      .compile();

    app = moduleRef.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterAll(() => app.close());

  it('rejects invalid sign-up data with field errors', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/sign-up')
      .send({ email: 'bad', name: 'ab', password: 'weak' })
      .expect(400);

    const fields = response.body.errors.map(
      (error: { field: string }) => error.field,
    );
    expect(fields).toEqual(
      expect.arrayContaining(['email', 'name', 'password']),
    );
  });

  it('signs up and returns a token without the password', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/sign-up')
      .send({ ...credentials, name: 'Sam' })
      .expect(201);

    expect(response.body.accessToken).toEqual(expect.any(String));
    expect(response.body.user).toEqual({
      id: '1',
      email: credentials.email,
      name: 'Sam',
    });
  });

  it('rejects a duplicate email', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/sign-up')
      .send({ ...credentials, name: 'Sam' })
      .expect(409);

    expect(response.body.errors[0].field).toBe('email');
  });

  it('rejects a wrong password', () => {
    return request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send({ ...credentials, password: 'Wrong0rd!' })
      .expect(401);
  });

  it('protects /users/me and returns the current user with a valid token', async () => {
    await request(app.getHttpServer()).get('/api/users/me').expect(401);

    const signIn = await request(app.getHttpServer())
      .post('/api/auth/sign-in')
      .send(credentials)
      .expect(200);

    const me = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${signIn.body.accessToken}`)
      .expect(200);

    expect(me.body).toEqual({ id: '1', email: credentials.email, name: 'Sam' });
  });
});