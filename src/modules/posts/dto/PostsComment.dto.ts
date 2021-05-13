import { IsNumber, IsString } from 'class-validator';

export class PostsCommentDto {
  @IsNumber()
  postId: number;

  @IsNumber()
  userId: number;

  @IsString()
  text: string;
}
