import { Injectable, InternalServerErrorException } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class BunnyService {
  private readonly STORAGE_ZONE_NAME = process.env.BUNNY_ZONE_NAME;
  private readonly ACCESS_KEY = process.env.BUNNY_API_KEY;
  private readonly HOSTNAME = process.env.BUNNY_HOSTNAME;
  private readonly PULL_ZONE_URL = process.env.BUNNY_PULL_ZONE_URL;

  async uploadFile(file: Express.Multer.File): Promise<{ url: string }> {
    if (
      !this.STORAGE_ZONE_NAME ||
      !this.ACCESS_KEY ||
      !this.HOSTNAME ||
      !this.PULL_ZONE_URL
    ) {
      console.error('Missing Bunny CDN environment variables');
      throw new InternalServerErrorException(
        'Bunny CDN configuration is incomplete.',
      );
    }

    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `${randomString}-${file.originalname}`;
    const uploadUrl = `https://${this.HOSTNAME}/${this.STORAGE_ZONE_NAME}/${filename}`;

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          AccessKey: this.ACCESS_KEY,
          'Content-Type': 'application/octet-stream',
        },
        body: file.buffer,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`🚨 Upload Failed: ${response.status} - ${errorText}`);
        throw new InternalServerErrorException(
          `Bunny CDN Upload Error: ${errorText}`,
        );
      }

      console.log(
        `✅ Successfully uploaded to BunnyCDN: ${this.PULL_ZONE_URL}/${filename}`,
      );
      return { url: `${this.PULL_ZONE_URL}/${filename}` };
    } catch (error) {
      console.error('🚨 Upload Error:', error);
      throw new InternalServerErrorException(
        'Failed to upload file to Bunny CDN.',
      );
    }
  }
}
