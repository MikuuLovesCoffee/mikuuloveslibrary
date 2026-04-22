// src/rating/dto/create-rating.dto.ts
import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  bookId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  value: number;
}
