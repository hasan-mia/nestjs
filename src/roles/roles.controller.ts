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

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  // @Roles('admin')
  // @UseGuards(JwtAuthGuard)
  create(@Body() dto: RoleDto) {
    return this.roleService.create(dto);
  }

  @Get('all')
  @Roles('admin')
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
