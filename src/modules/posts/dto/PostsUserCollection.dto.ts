import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostsUserCollectionDto {
  @IsNumber()
  userId: number;

  @IsString()
  @ApiProperty({ description: '文章名称' })
  title: string;

  @IsNumber()
  @ApiProperty({ description: '数量' })
  limit: number;

  @IsNumber()
  @ApiProperty({ description: '分页' })
  page: number;
}

export class PostsUserCollectionOneDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  postId: number;
}
