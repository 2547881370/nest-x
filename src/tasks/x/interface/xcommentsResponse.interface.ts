import { XdetailedEntity } from '../entity/Xdetailed.entity';
import { XuserEntity } from '../entity/Xuser.entity';

export interface XcommentsResponse {
  commentID: number;

  text: string;

  images: string[];

  voice: string;

  voiceTime: number;

  score: number;

  scoreTxt: string;

  seq: number;

  createTime: number;

  state: number;

  user: XuserEntity;

  scoreUserCount: number;

  scorecount: number;

  praise: number;

  posts: XdetailedEntity;
}
