import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostsDetailsDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  @ApiProperty({ description: '数量' })
  limit: number;

  @IsNumber()
  @ApiProperty({ description: '分页' })
  page: number;
}
