import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostsUserCollectionDto {
  @IsNumber()
  userId: number;
}

export class PostsUserCollectionOneDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  postId: number;
}
