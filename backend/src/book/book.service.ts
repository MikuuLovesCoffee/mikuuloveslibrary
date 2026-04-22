/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { supabase } from 'src/common/supabase';

@Injectable()
export class BookService {
  constructor(private prisma: PrismaService) {}

  async create(data: any, userId: number, publicId: string) {
    if (!data.fileUrl) {
      throw new Error('File URL is required');
    }

    return this.prisma.book.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        imageUrl: data.imageUrl ?? null,
        publicId,
        uploadedBy: {
          connect: { id: userId },
        },
      },
    });
  }

  async update(bookId: number, userId: number, data: any) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) throw new Error('Book not found');
    if (book.uploadedById !== userId) throw new Error('Forbidden');

    return this.prisma.book.update({
      where: { id: bookId },
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
      },
    });
  }

  async delete(bookId: number, userId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) throw new Error('Book not found');
    if (book.uploadedById !== userId) throw new Error('Forbidden');

    // delete file from Supabase
    await supabase.storage.from('books').remove([book.publicId]);

    return this.prisma.book.delete({
      where: { id: bookId },
    });
  }

  async findAll(page: number = 1) {
    const take = 10;
    const skip = (page - 1) * take;

    const books = await this.prisma.book.findMany({
      take,
      skip,
      include: {
        uploadedBy: {
          select: { id: true, email: true },
        },
        comments: {
          take: 3,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    return Promise.all(
      books.map(async (book) => {
        const rating = await this.prisma.rating.aggregate({
          where: { bookId: book.id },
          _avg: { value: true },
          _count: true,
        });

        return {
          ...book,
          averageRating: Number((rating._avg.value || 0).toFixed(2)),
          ratingsCount: rating._count,
        };
      }),
    );
  }
}
