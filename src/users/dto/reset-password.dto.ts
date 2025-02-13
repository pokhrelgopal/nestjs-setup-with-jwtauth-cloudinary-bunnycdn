import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @MaxLength(6, { message: 'OTP must be exactly 6 characters long' })
  @MinLength(6, { message: 'OTP must be exactly 6 characters long' })
  otp: string;
  @IsNotEmpty()
  newPassword: string;
}
