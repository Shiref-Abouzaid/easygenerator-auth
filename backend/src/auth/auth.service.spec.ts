import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;

  const usersService = {
    create: jest.fn(),
    findByEmailWithPassword: jest.fn(),
    toPublic: jest.fn(() => ({ id: 'user-id', email: 'a@b.com', name: 'Sam' })),
  };
  const jwtService = { signAsync: jest.fn().mockResolvedValue('signed-token') };

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    authService = moduleRef.get(AuthService);
  });

  it('stores a hash, never the plain password, on sign up', async () => {
    usersService.create.mockImplementation((data) => ({
      _id: 'user-id',
      ...data,
    }));

    const result = await authService.signUp({
      email: 'a@b.com',
      name: 'Sam',
      password: 'Passw0rd!',
    });

    const { passwordHash } = usersService.create.mock.calls[0][0];
    expect(passwordHash).not.toBe('Passw0rd!');
    await expect(argon2.verify(passwordHash, 'Passw0rd!')).resolves.toBe(true);
    expect(result.accessToken).toBe('signed-token');
  });

  it('signs in with the correct password', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue({
      _id: 'user-id',
      passwordHash: await argon2.hash('Passw0rd!'),
    });

    await expect(
      authService.signIn({ email: 'a@b.com', password: 'Passw0rd!' }),
    ).resolves.toMatchObject({ accessToken: 'signed-token' });
  });

  it('rejects a wrong password', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue({
      _id: 'user-id',
      passwordHash: await argon2.hash('Passw0rd!'),
    });

    await expect(
      authService.signIn({ email: 'a@b.com', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('rejects an unknown email with the same error', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(null);

    await expect(
      authService.signIn({ email: 'nobody@b.com', password: 'Passw0rd!' }),
    ).rejects.toThrow('Invalid email or password.');
  });
});