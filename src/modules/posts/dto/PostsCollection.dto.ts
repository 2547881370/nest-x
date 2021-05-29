import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PostsCollectionStatus } from '../enums/PostsCollection.enum';
import { PostsPraiseDeleteArrStatus } from '../enums/PostsPraise.enum';

export class PostsCollectionDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  userId: number;

  @ApiProperty({ description: '1 收藏 , 0 取消收藏' })
  @IsNumber()
  status: PostsCollectionStatus;
}

export class PostsDeleteCollectionDto {
  @IsNumber()
  userId: number;

  @IsArray()
  collectionIds?: number[];

  @ApiProperty({ description: '1全部删除' })
  @IsNumber()
  arrDelete?: PostsPraiseDeleteArrStatus;
}
