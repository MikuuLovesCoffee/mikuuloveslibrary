/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Req,
  Delete,
  Patch,
} from '@nestjs/common';

import { CommentService } from './comment.service';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';

@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  // 📌 CREATE COMMENT
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() dto: any, @Req() req: any) {
    return this.commentService.create(req.user.userId, dto.bookId, dto.content);
  }

  // 📌 GET COMMENTS BY BOOK (FIXED ROUTE)
  @Get(':bookId')
  getByBook(@Param('bookId') bookId: string) {
    return this.commentService.getByBook(Number(bookId));
  }

  // 📌 UPDATE COMMENT
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.commentService.update(
      Number(id),
      req.user.userId,
      body.content,
    );
  }

  // 📌 DELETE COMMENT
  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.commentService.delete(Number(id), req.user.userId);
  }
}
