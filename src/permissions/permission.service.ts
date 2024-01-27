import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entity/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  findAll(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  findOne(id: number): Promise<Permission | null> {
    return this.permissionRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.permissionRepository.delete(id);
  }
}
