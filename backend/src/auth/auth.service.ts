import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UserDocument } from '../users/schemas/user.schema';
import { PublicUser, UsersService } from '../users/users.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp({ email, name, password }: SignUpDto): Promise<AuthResponse> {
    const passwordHash = await argon2.hash(password);
    const user = await this.usersService.create({ email, name, passwordHash });
    return this.createSession(user);
  }

  async signIn({ email, password }: SignInDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.createSession(user);
  }

  private async createSession(user: UserDocument): Promise<AuthResponse> {
    const accessToken = await this.jwtService.signAsync({
      sub: user._id.toString(),
    });
    return { accessToken, user: this.usersService.toPublic(user) };
  }
}