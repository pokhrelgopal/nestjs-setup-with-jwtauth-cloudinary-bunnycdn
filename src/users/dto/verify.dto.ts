import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MaxLength(6, { message: 'OTP must be exactly 6 characters long' })
  @MinLength(6, { message: 'OTP must be exactly 6 characters long' })
  otp: string;
}
