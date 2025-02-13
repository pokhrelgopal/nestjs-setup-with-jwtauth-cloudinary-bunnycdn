import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '../../shared/mailer/mailer.service';
import { CreateUserDto } from 'src/interfaces/user.interface';
import { User } from '@prisma/client';
import { SuccessResponse } from 'src/interfaces/response.interface';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
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

  async getMe(user: any): Promise<SuccessResponse<any>> {
    if (!user || !user.sub) {
      throw new UnauthorizedException('User not found');
    }
    const foundUser = await this.prisma.user.findUnique({
      where: { id: user.sub },
      select: { id: true, email: true, fullName: true },
    });

    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }

    return {
      status: true,
      statusCode: 200,
      data: foundUser,
    };
  }

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
