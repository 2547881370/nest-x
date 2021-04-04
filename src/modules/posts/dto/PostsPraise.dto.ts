import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class PostsPraiseDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  @ApiProperty({ description: '数量' })
  count: number;
}
