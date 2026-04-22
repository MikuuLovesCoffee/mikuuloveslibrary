/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { RatingService } from './rating.service';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';
import { CreateRatingDto } from './dto/create-rating.dto';

@Controller('ratings')
export class RatingController {
  constructor(private ratingService: RatingService) {}

  @UseGuards(JwtGuard)
  @Post()
  rate(@Body() body: CreateRatingDto, @Req() req: any) {
    return this.ratingService.rateBook(
      req.user.userId,
      body.bookId,
      body.value,
    );
  }

  @Get(':bookId')
  getRating(@Param('bookId') bookId: string) {
    return this.ratingService.getBookRating(Number(bookId));
  }
}
