import { HttpService, Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { TaskParams } from './interface/task.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { XarticleEntity } from './entity/Xarticle.entity';
import { Connection, Repository } from 'typeorm';
import { XarticleResponseInterface } from './interface/xarticleResponse.interface';
import { XuserEntity } from './entity/Xuser.entity';
import { XimageEntity } from './entity/Ximage.entity';

import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

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
    cat_id: 56,
    tag_id: 0,
    sort_by: 0,
    start: 0,
  };

  private readonly dstpath = './images';

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(XarticleEntity)
    private readonly xarticleRepository: Repository<XarticleEntity>,
    private connection: Connection,
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
        user = b.user;

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
}
