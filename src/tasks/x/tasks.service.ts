import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TaskDetailedParams, TaskParams } from './interface/task.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { XarticleEntity } from './entity/Xarticle.entity';
import { Connection, Repository } from 'typeorm';
import { XarticleResponseInterface } from './interface/xarticleResponse.interface';
import { XuserEntity } from './entity/Xuser.entity';
import { XimageEntity } from './entity/Ximage.entity';

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { XdetailedResponse } from './interface/xdetailedResponse.interface';

import { map } from 'rxjs/operators';
import { XcommentsEntity } from './entity/Xcomments.entity';
import { XdetailedEntity } from './entity/Xdetailed.entity';

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
    cat_id: 56,
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
  ) {}

  @Interval(10000)
  async handerPosts() {
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
      for (let index = 0; index < x.data.posts.length; index++) {
        const b = x.data.posts[index];
        let user = new XuserEntity();
        let article = new XarticleEntity();

        user = Object.assign(b.user, {
          username: TasksService.USER.username,
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
          await this.downloadPic(imageUrl);
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

        // 创建一个事务
        const queryRunner = this.connection.createQueryRunner();
        // 事务连接
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
          await this.xarticleRepository.save(article);
          // 入库评论
          // await this.handerPostComment(b.postID, Math.ceil(b.commentCount / 20));
          await this.handerPostComment(b.postID, 1);
        } catch (err) {
          await queryRunner.rollbackTransaction();
        } finally {
          await queryRunner.release();
        }
      }
    });
  }

  async downloadPic(src: string) {
    return new Promise<void>(async (_resolve) => {
      this._mkdirSync(this.dstpath);
      const obs = await this.httpService.get(src, { responseType: 'stream' });
      obs.subscribe(async (x) => {
        const target_path = resolve(`${this.dstpath}/${src.split('/').pop()}`);
        await x.data.pipe(createWriteStream(target_path));
        _resolve();
      });
    });
  }

  _mkdirSync(_path) {
    if (existsSync(_path)) {
      return true;
    } else {
      if (this._mkdirSync(dirname(_path))) {
        mkdirSync(_path);
        return true;
      }
    }
    return false;
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
          post = response.data.post;

          let comments = [];
          for (let index = 0; index < response.data.comments.length; index++) {
            const b = response.data.comments[index];
            let comment = new XcommentsEntity();
            comment = b;
            const images = [];
            for (let imgIndex = 0; imgIndex < b.images.length; imgIndex++) {
              const imgUrl = b.images[imgIndex];
              await this.downloadPic(imgUrl);
              images.push({
                url: imgUrl,
              });
            }
            comment.images = images;
            comments.push(comment);
          }

          const detailed = new XdetailedEntity();
          detailed.posts = post;
          detailed.comments = comments = comments.map((b) => {
            b.posts = detailed;
            return b;
          });
          await this.XdetailedRepository.save(detailed);
          return response.data;
        }),
      )
      .toPromise();
  }
}
