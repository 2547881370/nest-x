import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import {
  PostsPraiseDeleteArrStatus,
  PostsPraiseStatus,
} from '../enums/PostsPraise.enum';

export class PostsPraiseDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  userId: number;

  @ApiProperty({ description: '1 点赞 , 0 取消点赞' })
  @IsNumber()
  status: PostsPraiseStatus;
}

export class PostsRemovePraiseDto {
  @IsNumber()
  userId: number;

  @IsArray()
  praiseIds?: number[];

  @ApiProperty({ description: '1全部删除' })
  @IsNumber()
  arrDelete?: PostsPraiseDeleteArrStatus;
}
