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

import { supabase } from 'src/common/supabase';

@Controller('books')
export class BookController {
  constructor(private bookService: BookService) {}

  @Post('upload')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('Uploader')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multer.memoryStorage(),
    }),
  )
  async upload(@UploadedFile() file: any, @Body() body: any, @Req() req: any) {
    if (!file) throw new Error('File is required');

    const fileName = `${Date.now()}-${file.originalname}`;

    const { error } = await supabase.storage
      .from('books')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.log('SUPABASE ERROR:', error);
      throw new Error('Upload failed');
    }

    const { data } = supabase.storage.from('books').getPublicUrl(fileName);

    return this.bookService.create(
      {
        title: body.title,
        description: body.description,
        fileUrl: data.publicUrl,
        imageUrl: body.imageUrl,
      },
      req.user.userId,
      fileName, // storage key
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
