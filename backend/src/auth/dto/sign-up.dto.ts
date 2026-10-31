import { Transform } from 'class-transformer';
import { IsEmail, Length, Matches, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class SignUpDto {
  @Transform(trim)
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  email: string;

  @Transform(trim)
  @Length(3, 50, { message: 'Name must be between 3 and 50 characters.' })
  name: string;

  @MaxLength(128, { message: 'Password must be at most 128 characters.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d\s]).{8,}$/, {
    message:
      'Password must be at least 8 characters and include a letter, a number and a special character.',
  })
  password: string;
}