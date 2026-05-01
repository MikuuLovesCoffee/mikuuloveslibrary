import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageService } from 'src/common/storage.service';

@Module({
  imports: [PrismaModule],
  providers: [BookService, StorageService],
  controllers: [BookController],
})
export class BookModule {}
