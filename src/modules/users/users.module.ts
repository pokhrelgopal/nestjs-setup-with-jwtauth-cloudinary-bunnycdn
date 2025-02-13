import { Module } from '@nestjs/common';
import { PrismaService } from '../../db/prisma.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { MailerService } from '../../shared/mailer/mailer.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [AuthModule, JwtModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailerService],
  exports: [UserService],
})
export class UsersModule {}
