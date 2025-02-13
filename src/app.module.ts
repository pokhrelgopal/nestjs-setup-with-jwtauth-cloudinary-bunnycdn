import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UsersModule } from './modules/users/users.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { BunnyModule } from './shared/bunny/bunny.module';
import { MailerModule } from './shared/mailer/mailer.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UsersModule,
    CloudinaryModule,
    BunnyModule,
    MailerModule,
    ConfigModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
