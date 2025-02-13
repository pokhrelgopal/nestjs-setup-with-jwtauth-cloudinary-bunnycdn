import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '../../shared/mailer/mailer.service';
import {
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
  VerifyDto,
} from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) {}

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
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);
    return { accessToken, refreshToken };
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

  async refreshToken(refreshToken: string): Promise<Record<string, string>> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const user = { id: payload.sub, email: payload.email };
      const token = this.generateAccessToken(user);
      return { token };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateAccessToken(user: any): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      },
    );
  }

  private generateRefreshToken(user: any): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d',
      },
    );
  }
}
