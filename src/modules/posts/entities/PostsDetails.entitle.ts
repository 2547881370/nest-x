import { XcommentsEntity } from 'src/tasks/x/entity/Xcomments.entity';
import { XdetailedEntity } from 'src/tasks/x/entity/Xdetailed.entity';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';

export class PostsDetailsEntitle implements XcommentsEntity {
  user: XuserEntity;
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
  scoreUserCount: number;
  scorecount: number;
  praise: number;
  posts: XdetailedEntity;
}
