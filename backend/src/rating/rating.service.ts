import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RatingService {
  constructor(private prisma: PrismaService) {}

  async rateBook(userId: number, bookId: number, value: number) {
    // enforce range (important)
    if (value < 1 || value > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    const existing = await this.prisma.rating.findUnique({
      where: {
        userId_bookId: {
          userId,
          bookId,
        },
      },
    });

    if (existing) {
      // update existing rating
      return this.prisma.rating.update({
        where: { id: existing.id },
        data: { value },
      });
    }

    // create new rating
    return this.prisma.rating.create({
      data: {
        value,
        userId,
        bookId,
      },
    });
  }

  async getBookRating(bookId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: { bookId },
    });

    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const avg = ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;

    return {
      average: Number(avg.toFixed(2)),
      count: ratings.length,
    };
  }
}
