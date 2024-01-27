import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entity/users.entity';
import { Role } from './entity/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
