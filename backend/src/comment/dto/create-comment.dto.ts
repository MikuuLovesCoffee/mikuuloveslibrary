// src/comment/dto/create-comment.dto.ts
import { IsInt, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsInt()
  bookId: number;

  @IsString()
  content: string;
}
