import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TaskDetailedParams, TaskParams } from './interface/task.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { XarticleEntity } from './entity/Xarticle.entity';
import { Connection, getConnection, Repository } from 'typeorm';
import { XarticleResponseInterface } from './interface/xarticleResponse.interface';
import { XuserEntity } from './entity/Xuser.entity';
import { XimageEntity } from './entity/Ximage.entity';

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { XdetailedResponse } from './interface/xdetailedResponse.interface';

import { map } from 'rxjs/operators';
import { XcommentsEntity } from './entity/Xcomments.entity';
import { XdetailedEntity } from './entity/Xdetailed.entity';
import { XPostsListStartEntity } from './entity/XpostsListStart.entity';
import { Utils } from 'src/common/public';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  private readonly params: TaskParams = {
    platform: 1,
    gkey: '000000',
    app_version: '4.0.0.1.2',
    versioncode: '20141417',
    market_id: 'floor_web',
    _key: '',
    device_code:
      '[w]00:81:0e:1b:c4:b0-[i]865166021747665-[s]89860037810647646094',
    count: 20,
    // 频道
    // cat_id: 56,
    cat_id: 29,
    // 类型: 全部0 ; 原创5601 ' 网络5602  == 对应真实字段tagid
    tag_id: 0,
    // 排序: 回复时间0 ;按发布时间 1 ;  按版本精华2 == 对应真实字段createTime和activeTime
    sort_by: 0,
    start: 0,
  };

  private readonly DetailedParams: TaskDetailedParams = {
    platform: 2,
    gkey: '000000',
    app_version: '4.0.0.1.2',
    versioncode: '20141417',
    market_id: 'floor_web',
    _key: '',
    device_code:
      '[w]00:81:0e:1b:c4:b0-[i]865166021747665-[s]89860037810647646094',
    // 当前文章id
    post_id: null,
    // 当前文章评论总共有多少页 可以通过文章的 Math.ceil(commentCount/20)
    page_no: 1,
    page_size: 20,
    doc: 1,
  };

  static readonly USER = {
    username: 'SH',
    password: '123456',
  };

  private readonly dstpath = './images';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(XarticleEntity)
    private readonly xarticleRepository: Repository<XarticleEntity>,
    private connection: Connection,
    @InjectRepository(XdetailedEntity)
    private readonly XdetailedRepository: Repository<XdetailedEntity>,
    @InjectRepository(XPostsListStartEntity)
    private readonly xPostsListStartEntity: Repository<XPostsListStartEntity>,
    @InjectRepository(XuserEntity)
    private readonly xUserEntity: Repository<XuserEntity>,
  ) {}

  @Interval(10000)
  async handerPosts() {
    try {
      const postListStart = await this.xPostsListStartEntity.findOne();
      if (postListStart) {
        const { start } = postListStart;
        this.params.start = start;
      }
      const obs = await this.httpService.get<XarticleResponseInterface>(
        'http://floor.huluxia.com/post/list/ANDROID/2.1',
        {
          params: this.params,
          headers: {
            Connection: 'close',
            Host: 'floor.huluxia.com',
            'User-Agent': 'okhttp/3.8.1',
          },
        },
      );

      obs.subscribe(async (x) => {
        this.params.start = x.data.start;

        if (!postListStart) {
          const newPostListStart = new XPostsListStartEntity();
          newPostListStart.start = x.data.start;
          await this.xPostsListStartEntity.save(newPostListStart);
        } else {
          postListStart.start = x.data.start;
          await getConnection()
            .createQueryBuilder()
            .update(XPostsListStartEntity)
            .set({
              start: x.data.start,
            })
            .where('startID = :startID', { startID: postListStart.startID })
            .execute();
        }

        this.logger.debug(postListStart.start);

        for (let index = 0; index < x.data.posts.length; index++) {
          const b = x.data.posts[index];
          let user = new XuserEntity();
          let article = new XarticleEntity();

          user = Object.assign(b.user, {
            username: b.user.nick,
            password: TasksService.USER.password,
          });

          b.detail = `${b.detail}`;
          article = {
            ...b,
            user: user,
          };

          const images = [];

          for (let imgIndex = 0; imgIndex < b.images.length; imgIndex++) {
            const imageUrl = b.images[imgIndex];
            const newImg = new XimageEntity();
            newImg.url = imageUrl;
            newImg.article = article;
            // try {
            //   await this.downloadPic(imageUrl);
            // } catch (err) {}
            images.push(newImg);
          }

          article.images = images;

          const p = await this.xarticleRepository.find({
            where: {
              postID: article.postID,
            },
          });

          // 文章重复则跳过
          if (p && p.length > 0) {
            this.logger.debug('存在: ' + article.postID);
            return false;
          }

          article.createTime = Date.now();
          article.recommendationLevel = 0;

          // 创建一个事务
          const queryRunner = this.connection.createQueryRunner();
          // 事务连接
          await queryRunner.connect();
          await queryRunner.startTransaction();
          try {
            // 入库用户
            const userInfo = await this.xUserEntity.findOne({
              where: {
                userID: user.userID,
              },
            });
            if (!userInfo) {
              await this.xUserEntity.save(user);
            }

            // 入库文章
            await this.xarticleRepository.save(article);

            // 入库评论
            // await this.handerPostComment(b.postID, Math.ceil(b.commentCount / 20));
            await this.handerPostComment(b.postID, 1);
          } catch (err) {
            this.logger.debug(err);
            await queryRunner.rollbackTransaction();
          } finally {
            await queryRunner.release();
          }
        }
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async downloadPic(src: string) {
    try {
      return new Promise<void>(async (_resolve) => {
        Utils.mkdirSync(this.dstpath);
        const obs = await this.httpService.get(src, { responseType: 'stream' });
        obs.subscribe(async (x) => {
          const target_path = resolve(
            `${this.dstpath}/${src.split('/').pop()}`,
          );
          await x.data.pipe(createWriteStream(target_path));
          _resolve();
        });
      });
    } catch (err) {
      this.logger.error(err);
    }
  }

  async handerPostComment(postId: number, pageNo: number): Promise<any> {
    this.DetailedParams.post_id = postId;
    this.DetailedParams.page_no = pageNo;

    return this.httpService
      .get<XdetailedResponse>(
        'http://floor.huluxia.com/post/detail/ANDROID/2.3',
        {
          params: this.DetailedParams,
          headers: {
            Connection: 'close',
            Host: 'floor.huluxia.com',
            'User-Agent': 'okhttp/3.8.1',
          },
        },
      )
      .pipe(
        map(async (response) => {
          let post = new XarticleEntity();
          let postUser = new XuserEntity();
          postUser = Object.assign(response.data.post.user, {
            username: response.data.post.user.nick,
            password: TasksService.USER.password,
          });
          post = response.data.post;
          post.user = postUser;

          let comments = [];
          for (let index = 0; index < response.data.comments.length; index++) {
            const b = response.data.comments[index];
            let comment = new XcommentsEntity();
            comment = b;
            const images = [];
            for (let imgIndex = 0; imgIndex < b.images.length; imgIndex++) {
              const imgUrl = b.images[imgIndex];
              // try {
              //   await this.downloadPic(imgUrl);
              // } catch (err) {}
              images.push({
                url: imgUrl,
              });
            }
            let user = new XuserEntity();
            user = Object.assign(b.user, {
              username: b.user.nick,
              password: TasksService.USER.password,
            });
            comment.user = user;
            comment.images = images;
            comments.push(comment);
          }

          const detailed = new XdetailedEntity();
          detailed.posts = post;
          detailed.comments = comments = comments.map((b) => {
            b.posts = detailed;
            return b;
          });
          try {
            await this.XdetailedRepository.save(detailed);
          } catch (err) {
            this.logger.debug(err);
          }
          return response.data;
        }),
      )
      .toPromise();
  }
}
