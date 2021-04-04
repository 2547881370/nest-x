import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostsCollectionStatus } from '../enums/PostsCollection.enum';

export class PostsCollectionDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  userId: number;

  @ApiProperty({ description: '1 收藏 , 0 取消收藏' })
  @IsNumber()
  status: PostsCollectionStatus;
}
