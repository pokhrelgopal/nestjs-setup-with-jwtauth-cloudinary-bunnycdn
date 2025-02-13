import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsBoolean,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  image?: File;

  @IsOptional()
  @IsString()
  otp?: string;

  @IsOptional()
  @IsString()
  resetToken?: string;

  @IsOptional()
  resetTokenExpires?: Date;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  @MaxLength(6, { message: 'OTP must be exactly 6 characters long' })
  @MinLength(6, { message: 'OTP must be exactly 6 characters long' })
  otp: string;
  @IsNotEmpty()
  newPassword: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class VerifyDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MaxLength(6, { message: 'OTP must be exactly 6 characters long' })
  @MinLength(6, { message: 'OTP must be exactly 6 characters long' })
  otp: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  token: string;
}
