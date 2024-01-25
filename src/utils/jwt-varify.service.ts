import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtVarifyService {
  constructor(private readonly jwtService: JwtService) {}

  verifyAccessToken(token: string): any {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_ACCESS_TOKEN,
      });
      return decodedToken;
    } catch (error) {
      throw new ForbiddenException('Invalid access token');
    }
  }

  verifyResetToken(token: string): any {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_TOKEN,
      });
      return decodedToken;
    } catch (error) {
      throw new ForbiddenException('Invalid reset token');
    }
  }
}
