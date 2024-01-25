import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entity/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(dto: any) {
    const { role_name } = dto;
    const existingRole = await this.roleRepository.findOne({
      where: [{ role_name }],
    });
    if (existingRole) {
      throw new ConflictException('Role with the same name already exists.');
    }

    const role = this.roleRepository.create(dto);
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOne({ where: [{ id }] });
    if (!role) {
      throw new NotFoundException('Role not found.');
    }
    return role;
  }

  async update(id: number, dto) {
    await this.findOne(id);

    await this.roleRepository.update(id, dto);
    return this.roleRepository.findOne({ where: [{ id }] });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.roleRepository.delete(id);
  }
}
