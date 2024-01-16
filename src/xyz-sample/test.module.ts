import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { TestsService } from './test.service';

@Module({
  imports: [],
  controllers: [TestController],
  providers: [TestsService],
})
export class AppModule {}
