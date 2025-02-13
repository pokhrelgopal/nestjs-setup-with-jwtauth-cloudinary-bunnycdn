import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RefreshTokenStrategy } from './jwt.strategy';
import { PrismaService } from 'src/db/prisma.service';
import { MailerService } from 'src/shared/mailer/mailer.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    AuthService,
    AuthGuard,
    RefreshTokenStrategy,
    PrismaService,
    MailerService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
