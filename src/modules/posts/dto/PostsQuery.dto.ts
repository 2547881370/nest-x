import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortBy, TagId } from '../enums/PostsQuery.enum';

export class PostsQueryDto {
  @IsNumber()
  @ApiProperty({ description: '数量' })
  limit: number;

  @IsNumber()
  @ApiProperty({ description: '分页' })
  page: number;

  @IsNumber()
  @ApiProperty({
    description: "类型: 全部0 ; 原创5601 ' 网络5602",
    enum: TagId,
  })
  readonly tag_id: TagId;

  @IsNumber()
  @ApiProperty({
    description: '排序: 回复时间0 ;按发布时间 1',
    enum: SortBy,
  })
  readonly sort_by: SortBy;
}
