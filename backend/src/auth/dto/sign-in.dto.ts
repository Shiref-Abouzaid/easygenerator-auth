import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { SignUpDto } from './sign-up.dto';

export class SignInDto extends PickType(SignUpDto, ['email'] as const) {
  @IsString({ message: 'Password is required.' })
  @IsNotEmpty({ message: 'Password is required.' })
  password: string;
}