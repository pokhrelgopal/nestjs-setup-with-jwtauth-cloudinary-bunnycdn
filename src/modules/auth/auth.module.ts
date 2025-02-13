import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RefreshTokenStrategy } from './jwt.strategy';
import { PrismaService } from 'src/db/prisma.service';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
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
