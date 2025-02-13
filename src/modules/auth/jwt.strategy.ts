import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private jwtService: JwtService) {
    super({
      jwtFromRequest: (req) => req.body.refreshToken,
      secretOrKey: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    });
  }
  async validate(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
