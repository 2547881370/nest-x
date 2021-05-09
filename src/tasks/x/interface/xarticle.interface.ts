import { XimageEntity } from '../entity/Ximage.entity';
import { XuserEntity } from '../entity/Xuser.entity';

export interface XarticleInterface {
  postID: number;

  title: string;

  detail: string;

  voice: string;

  score: number;

  scoreTxt: string;

  hit: number;

  commentCount: number;

  notice: number;

  weight: number;

  isGood: number;

  createTime: number;

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

  user: XuserEntity;
}
