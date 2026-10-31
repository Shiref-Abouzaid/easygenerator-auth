import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/guards/jwt-auth.guard';
import { PublicUser, UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() request: AuthenticatedRequest): Promise<PublicUser> {
    const user = await this.usersService.findById(request.user.sub);

    if (!user) {
      throw new UnauthorizedException('User no longer exists.');
    }

    return this.usersService.toPublic(user);
  }
}