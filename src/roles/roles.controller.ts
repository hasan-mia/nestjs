import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoleDto } from './dto/role.dto';
import { Role } from './entity/role.entity';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/role.guard';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get('admin-only')
  // @Roles('admin')
  adminOnlyRoute() {
    return 'This route is only accessible to users with the "admin" role';
  }

  @Get('user-and-admin')
  @Roles('user', 'admin')
  userAndAdminRoute() {
    return 'This route is accessible to users with the "user" or "admin" role';
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  create(@Body() dto: RoleDto) {
    return this.roleService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  // @Roles('admin')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Role> {
    return this.roleService.findOne(+id);
  }

  @Put(':id')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() dto: RoleDto): Promise<Role> {
    return this.roleService.update(+id, dto);
  }

  @Delete(':id')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string): Promise<void> {
    return this.roleService.remove(+id);
  }
}
