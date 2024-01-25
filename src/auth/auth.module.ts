import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from 'src/users/users.service';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Role } from '../roles/entity/role.entity';
import { UserRole } from './entity/userrole.entity';
import { JwtVarifyService } from 'src/utils/jwt-varify.service';

@Module({
  imports: [
    UsersModule,
    JwtModule,
    PassportModule,
    TypeOrmModule.forFeature([User, Role, UserRole]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UsersService,
    JwtStrategy,
    RefreshTokenStrategy,
    JwtVarifyService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
