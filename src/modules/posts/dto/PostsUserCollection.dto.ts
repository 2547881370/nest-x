import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostsUserCollectionDto {
  @IsNumber()
  userId: number;
}