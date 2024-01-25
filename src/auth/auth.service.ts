import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtVarifyService } from 'src/utils/jwt-varify.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private jwtVarifyService: JwtVarifyService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // =================================//
  //          SignUp function         //
  //==================================//
  async signUp(dto: any, res: any) {
    const { name, email, password } = dto;

    // check already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    // generate hash password
    const hashPassword = await this.hashPassword(password);

    // Create user entity
    const newUser = await this.userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    // Save user and user role
    const user = await this.userRepository.save(newUser);

    // Generate and save reset token on the user entity
    const resetToken = await this.generateResetToken({ id: user.id });
    user.reset_token = resetToken;
    await this.userRepository.save(user);

    // generate access token
    const accessToken = await this.generateAccessToken({ id: user.id });

    if (!accessToken && !resetToken) {
      throw new ForbiddenException('Failed to login');
    }

    // Set the cookie
    this.sendTokenCookie(res, accessToken, resetToken);

    return res.send({
      message: 'Signup success',
      token: {
        acces_token: accessToken,
        refresh_token: resetToken,
      },
    });
  }

  // =================================//
  //          SignIn function         //
  //==================================//
  async signIn(dto: any, res: any) {
    const { email, username, password } = dto;
    const user = await this.userRepository.findOne({
      where: [{ email }, { username }],
    });

    if (!user) {
      throw new BadRequestException('Wrong email or username');
    }

    const compareSuccess = await this.comparePasswords({
      password,
      hash: user.password,
    });

    if (!compareSuccess) {
      throw new BadRequestException('Wrong password');
    }

    // Generate reset token and update it on the user entity
    const resetToken = await this.generateResetToken({ id: user.id });
    user.reset_token = resetToken;

    await this.userRepository.save(user);

    // generate access token
    const accessToken = await this.generateAccessToken({ id: user.id });

    // return payload;
    if (!accessToken && !resetToken) {
      throw new ForbiddenException('Failed to login');
    }

    // Set the cookie
    this.sendTokenCookie(res, accessToken, resetToken);

    return res.send({
      message: 'Signin success',
      token: {
        acces_token: accessToken,
        refresh_token: resetToken,
      },
    });
  }

  // =================================//
  //         Signout function         //
  //==================================//
  async signout(res: any) {
    res.clearCookie('token');
    return res.send({ message: 'Signout succefully' });
  }

  // =================================//
  //      Reset token function        //
  //==================================//
  async resetToken(req: any, res: any) {
    // Extract the reset_token from headers
    const resetTokenFromHeader = req.headers['refresh_token'];
    if (!resetTokenFromHeader) {
      throw new BadRequestException('Reset token not provided in headers');
    }

    // Verify the reset_token and decode the payload
    const decodedResetToken =
      this.jwtVarifyService.verifyResetToken(resetTokenFromHeader);

    const { id } = decodedResetToken;

    // Find the user by id
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a new reset token
    const resetToken = await this.generateResetToken({ id: user.id });

    // Update user entity with the new reset token
    user.reset_token = resetToken;
    await this.userRepository.save(user);

    const accessToken = await this.generateAccessToken({ id: user.id });

    // return payload;
    if (!accessToken && !resetToken) {
      throw new ForbiddenException('Failed to login');
    }

    // Set the cookie
    this.sendTokenCookie(res, accessToken, resetToken);

    return res.send({
      message: 'Reset token generated successfully',
      token: {
        acces_token: accessToken,
        refresh_token: resetToken,
      },
    });
  }

  // =================================//
  //          Common function         //
  //==================================//
  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async comparePasswords(args: { hash: string; password: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async generateAccessToken(args: { id: number }) {
    const payload = {
      id: args.id,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN,
      expiresIn: '24hr',
    });

    return token;
  }

  async generateResetToken(args: { id: number }) {
    const payload = {
      id: args.id,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_RESET_TOKEN,
      expiresIn: '15d',
    });

    return token;
  }

  private sendTokenCookie(res: any, accessToken: string, resetToken: string) {
    res.cookie(
      'token',
      { access_token: accessToken, refresh_token: resetToken },
      {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    );
  }
}
