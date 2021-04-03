import { XcommentsEntity } from './../entity/Xcomments.entity';
import { XarticleInterface } from './xarticle.interface';

export interface XdetailedResponse {
  post: XarticleInterface;
  comments: XcommentsEntity[];
  totalPage: number;
  pageSize: number;
  categoryID: number;
}
