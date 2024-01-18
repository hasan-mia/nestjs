import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { SignInDto } from './dto/signin.dto';

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
  signIn(@Body() SignInDto, @Res({ passthrough: true }) res) {
    return this.authService.signIn(SignInDto, res);
  }
}
