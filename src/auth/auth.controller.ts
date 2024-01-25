import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Signup controller
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  signUp(@Body() dto: SignUpDto, @Res({ passthrough: true }) res) {
    return this.authService.signUp(dto, res);
  }

  // Signin controller
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  signIn(@Body() dto: SignInDto, @Res({ passthrough: true }) res) {
    return this.authService.signIn(dto, res);
  }

  // Signout controller
  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signout(@Res({ passthrough: true }) res) {
    return this.authService.signout(res);
  }

  // reset token controller
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @Post('reset-token')
  resetToken(@Req() req, @Res() res) {
    return this.authService.resetToken(req, res);
  }
}
