import { Global, Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

@Global()
@Injectable()
export class ConfigService {
  constructor(private readonly configService: NestConfigService) {}

  get port(): number {
    return +(this.configService.get<string>('PORT') ?? '5000');
  }

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }

  get googleEmail(): string {
    return this.configService.get<string>('GOOGLE_EMAIL') || '';
  }

  get googlePassword(): string {
    return this.configService.get<string>('GOOGLE_PASSWORD') || '';
  }

  get cloudinaryUploadPreset(): string {
    return this.configService.get<string>('CLOUDINARY_UPLOAD_PRESET') || '';
  }

  get cloudinaryApiUrl(): string {
    return this.configService.get<string>('CLOUDINARY_API_URL') || '';
  }

  get cloudinaryApiKey(): string {
    return this.configService.get<string>('CLOUDINARY_API_KEY') || '';
  }

  get cloudinaryApiSecret(): string {
    return this.configService.get<string>('CLOUDINARY_API_SECRET') || '';
  }

  get cloudinaryCloudName(): string {
    return this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || '';
  }

  get bunnyHostname(): string {
    return this.configService.get<string>('BUNNY_HOSTNAME') || '';
  }

  get bunnyZoneName(): string {
    return this.configService.get<string>('BUNNY_ZONE_NAME') || '';
  }

  get bunnyApiKey(): string {
    return this.configService.get<string>('BUNNY_API_KEY') || '';
  }

  get bunnyPullZoneUrl(): string {
    return this.configService.get<string>('BUNNY_PULL_ZONE_URL') || '';
  }

  get frontendUrl(): string {
    return this.configService.get<string>('FRONTEND_URL') || '';
  }

  get backendUrl(): string {
    return this.configService.get<string>('BACKEND_URL') || '';
  }
}
