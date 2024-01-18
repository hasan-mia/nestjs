import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { classToPlain } from 'class-transformer';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entity/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(Users)
    private authRepository: Repository<Users>,
  ) {}

  // =================================//
  //          SignUp function         //
  //==================================//
  async signUp(dto: any, res) {
    const { name, email, password } = dto;
    // check already exists
    const existingUser = await this.authRepository.findOne({
      where: [{ email }],
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // generate hash password
    const hashPassword = await this.hashPassword(password);

    // final data to save
    const data = {
      name,
      email,
      password: hashPassword,
    };

    const createUser = this.authRepository.create(data);
    const user = await this.authRepository.save(createUser);
    // convert json object

    const userObj = JSON.parse(JSON.stringify(classToPlain(user)));

    // generate access token
    const accessToken = await this.generateAccessToken({ id: userObj.id });
    const refreshToken = await this.generateRefreshToken({ id: userObj.id });

    if (!accessToken && !refreshToken) {
      throw new ForbiddenException('Failed to login');
    }

    const token = {
      acces_token: accessToken,
      refresh_token: accessToken,
    };
    // Set the cookie
    res.cookie('token', token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    return res.send({ message: 'Signup success', token });
  }

  // =================================//
  //          SignIn function         //
  //==================================//

  async signIn(dto: any, res) {
    const { email, username, password } = dto;
    const user = await this.authRepository.findOne({
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

    // generate access token
    const accessToken = await this.generateAccessToken({ id: user.id });
    const refreshToken = await this.generateRefreshToken({ id: user.id });

    // return payload;
    if (!accessToken && !refreshToken) {
      throw new ForbiddenException('Failed to login');
    }

    const token = {
      acces_token: accessToken,
      refresh_token: accessToken,
    };

    return res.send({ message: 'Signin success', token });
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

  async generateRefreshToken(args: { id: number }) {
    const payload = {
      id: args.id,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_TOKEN,
      expiresIn: '15d',
    });

    return token;
  }
}
