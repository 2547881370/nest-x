import { ApiProperty } from '@nestjs/swagger';
import { XarticleEntity } from 'src/tasks/x/entity/Xarticle.entity';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { XarticleInterface } from 'src/tasks/x/interface/xarticle.interface';

export class PostsQueryEntitie implements XarticleInterface {
  recommendationLevel: number;

  voice: string;

  postID: number;

  @ApiProperty({ description: '文章标题' })
  title: string;

  @ApiProperty({ description: '文字简介' })
  detail: string;

  score: number;

  scoreTxt: string;

  @ApiProperty({ description: '观看数量' })
  hit: number;

  @ApiProperty({ description: '评论数量' })
  commentCount: number;

  notice: number;

  weight: number;

  isGood: number;

  @ApiProperty({ description: '创建时间' })
  createTime: number;

  @ApiProperty({ description: '最后更新时间' })
  activeTime: number;

  line: number;

  tagid: number;

  status: number;

  praise: number;

  isAuthention: number;

  isRich: number;

  appOrientation: number;

  isAppPost: number;

  appSize: number;

  isGif: number;

  images: string[];

  @ApiProperty({ description: '发布者' })
  user: XuserEntity;

  @ApiProperty({ description: '文章集合' })
  post: XarticleEntity[];
}
