import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entity/test.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private testsRepository: Repository<Test>,
  ) {}

  findAll(): Promise<Test[]> {
    return this.testsRepository.find();
  }

  findOne(id: number): Promise<Test | null> {
    return this.testsRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.testsRepository.delete(id);
  }
}
