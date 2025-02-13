import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { MailerService } from '../mailer/mailer.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService, PrismaService, MailerService],
  exports: [UserService],
})
export class UsersModule {}
