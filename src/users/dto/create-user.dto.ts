import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
  IsBoolean,
  IsString,
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
