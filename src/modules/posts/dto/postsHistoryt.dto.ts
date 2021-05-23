import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { PostsHistoryStatus } from '../enums/postsHistoryStatus.enum';

export class PostsHistorytDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  userId: number;

  @ApiProperty({ description: '1 新增浏览记录 , 0 删除浏览记录' })
  @IsNumber()
  status: PostsHistoryStatus;
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
