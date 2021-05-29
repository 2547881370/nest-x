import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsArray } from 'class-validator';
import {
  PostsHistoryDeleteArrStatus,
  PostsHistoryStatus,
} from '../enums/postsHistoryStatus.enum';

export class PostsHistorytDto {
  @IsArray()
  postIds: number[];

  @IsNumber()
  userId: number;

  @IsArray()
  historyIDs?: number[];

  @ApiProperty({ description: '1 新增浏览记录 , 0 删除浏览记录' })
  @IsNumber()
  status: PostsHistoryStatus;

  @ApiProperty({ description: '1全部删除' })
  @IsNumber()
  arrDelete?: PostsHistoryDeleteArrStatus;
}

export class PostsHistoryListtDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  @ApiProperty({ description: '数量' })
  limit: number;

  @IsNumber()
  @ApiProperty({ description: '分页' })
  page: number;
}
