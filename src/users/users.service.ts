import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { email, password, fullName } = createUserDto;
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.mailerService.sendOtpMail(email, otp);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        otp,
      },
      select: { id: true, email: true, fullName: true },
    });
    return { message: 'User registered. Please verify your email.', user };
  }

  async verifyEmail(verifyDto: VerifyDto) {
    const { email, otp } = verifyDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    await this.prisma.user.update({
      where: { email },
      data: { isVerified: true, otp: null },
    });
    return { message: 'Email verified successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.jwtService.sign({ userId: user.id });
    return { token };
  }

  async getMe(user) {
    const foundUser = await this.prisma.user.findUnique({
      where: { id: user.userId },
      select: { id: true, email: true, fullName: true },
    });
    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }
    return foundUser;
  }

  async logout() {
    return { message: 'User logged out successfully' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    await this.prisma.user.update({
      where: { email },
      data: { resetToken, resetTokenExpires: new Date(Date.now() + 3600000) },
    });
    console.log('OTP for resetting password : ', resetToken);
    await this.mailerService.sendResetOtp(email, resetToken);
    return { message: 'Reset token sent to email' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const { otp, newPassword } = resetPasswordDto;
    const user = await this.prisma.user.findFirst({
      where: { resetToken: otp, resetTokenExpires: { gt: new Date() } },
    });
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });
    return { message: 'Password reset successfully' };
  }
}
