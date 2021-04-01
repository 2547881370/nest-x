import { XarticleInterface } from './xarticle.interface';

export interface XarticleResponseInterface {
  start: number;
  more: number;
  posts: XarticleInterface[];
}
