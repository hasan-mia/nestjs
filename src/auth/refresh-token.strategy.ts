import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh-token',
) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_REFRESH_TOKEN,
    });
  }

  // async validate(payload: any) {
  //   const user = await this.authService.validateRefreshToken(
  //     payload.sub,
  //     payload.refreshToken,
  //   );
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid refresh token');
  //   }
  //   return user;
  // }
}
