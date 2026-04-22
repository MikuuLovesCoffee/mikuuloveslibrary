import { Module } from '@nestjs/common';
import { TestController } from './test.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TestController],
  imports: [PrismaModule],
})
export class TestModule {}
