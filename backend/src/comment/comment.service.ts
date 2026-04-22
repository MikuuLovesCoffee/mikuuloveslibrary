import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // 📌 CREATE
  async create(userId: number, bookId: number, content: string) {
    return this.prisma.comment.create({
      data: {
        content,
        userId,
        bookId,
      },
    });
  }

  async getByBook(bookId: number) {
    return this.prisma.comment.findMany({
      where: { bookId },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(commentId: number, userId: number) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new Error('Comment not found');
    if (comment.userId !== userId) throw new Error('Forbidden');

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }

  // 📌 UPDATE
  async update(commentId: number, userId: number, content: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) throw new Error('Comment not found');
    if (comment.userId !== userId) throw new Error('Forbidden');

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
    });
  }
}
