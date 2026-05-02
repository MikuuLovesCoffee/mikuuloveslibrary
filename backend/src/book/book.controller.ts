/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { BookService } from './book.service';

import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { RolesGuard } from '../auth/guards/jwt/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

import { StorageService } from 'src/common/storage.service';

@Controller('books')
export class BookController {
  constructor(
    private bookService: BookService,
    private storageService: StorageService,
  ) {}

  @Post('upload')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('Uploader', 'Admin')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async upload(@UploadedFile() file: any, @Body() body: any, @Req() req: any) {
    if (!file) throw new Error('File is required');

    const fileName = `${file.originalname}`;

    // upload to your bucket
    const fileUrl = await this.storageService.upload(
      fileName,
      file.buffer,
      file.mimetype,
    );

    // save in DB
    return this.bookService.create(
      {
        title: body.title,
        description: body.description,
        fileUrl,
        imageUrl: body.imageUrl,
      },
      req.user.userId,
      fileName,
    );
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.bookService.delete(Number(id), req.user.userId);
  }

  @Get()
  findAll(@Query('page') page: string) {
    return this.bookService.findAll(Number(page) || 1);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.bookService.update(Number(id), req.user.userId, body);
  }

  @UseGuards(JwtGuard)
  @Get('debug')
  debug(@Req() req: any) {
    return req.user;
  }
}
