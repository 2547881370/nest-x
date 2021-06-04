import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XarticleEntity } from 'src/tasks/x/entity/Xarticle.entity';
import { XdetailedEntity } from 'src/tasks/x/entity/Xdetailed.entity';
import {
  createConnection,
  createQueryBuilder,
  Like,
  Repository,
} from 'typeorm';
import { PostsDetailsDto } from './dto/PostsDetails.dto';
import { PostsQueryDto } from './dto/PostsQuery.dto';
import { SortBy, TagId } from './enums/PostsQuery.enum';
import { ForbiddenException } from '../../common/exception/forbidden.exception';
import { XcommentsEntity } from 'src/tasks/x/entity/Xcomments.entity';
import { PostsPraiseDto, PostsRemovePraiseDto } from './dto/PostsPraise.dto';
import { getConnection } from 'typeorm';
import {
  PostsCollectionDto,
  PostsDeleteCollectionDto,
} from './dto/PostsCollection.dto';
import { XcollectionEntity } from 'src/tasks/x/entity/Xcollection.entity';
import { PostsCollectionStatus } from './enums/PostsCollection.enum';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import {
  PostsUserCollectionDto,
  PostsUserCollectionOneDto,
} from './dto/PostsUserCollection.dto';
import { XpraiseEntity } from 'src/tasks/x/entity/Xpraise.entity';
import {
  PostsPraiseDeleteArrStatus,
  PostsPraiseStatus,
} from './enums/PostsPraise.enum';
import { PostsCommentDto } from './dto/PostsComment.dto';
import {
  PostsHistoryListtDto,
  PostsHistorytDto,
} from './dto/postsHistoryt.dto';
import { Xhistory } from 'src/tasks/x/entity/Xhistory.entity';
import {
  PostsHistoryDeleteArrStatus,
  PostsHistoryStatus,
} from './enums/postsHistoryStatus.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PostsService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(XarticleEntity)
    private readonly xarticleRepository: Repository<XarticleEntity>,
    @InjectRepository(XdetailedEntity)
    private readonly XdetailedRepository: Repository<XdetailedEntity>,
    @InjectRepository(XcommentsEntity)
    private readonly xcommentsEntity: Repository<XcommentsEntity>,
    @InjectRepository(XcollectionEntity)
    private readonly xcollectionEntity: Repository<XcollectionEntity>,
    @InjectRepository(XuserEntity)
    private readonly xuserRepository: Repository<XuserEntity>,
    @InjectRepository(XpraiseEntity)
    private readonly xpraiseRepository: Repository<XpraiseEntity>,
    @InjectRepository(Xhistory)
    private readonly xhistoryRepository: Repository<Xhistory>,
  ) {}

  async list(options: PostsQueryDto) {
    // 默认以回复时间排序
    // 默认以全部进行查询
    const {
      limit = 20,
      page = 1,
      tag_id = TagId.arr,
      sort_by = SortBy.activeTime,
      title,
    } = options;

    const connection = getConnection();
    let find = connection
      .getRepository(XarticleEntity)
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.images', 'images')
      .leftJoinAndSelect('a.user', 'user');

    if (sort_by === SortBy.activeTime) {
      find = find.orderBy('a.activeTime', 'DESC');
    } else {
      find = find.orderBy('a.createTime', 'DESC');
    }

    if (tag_id !== TagId.arr) {
      find = find.where('a.tagid = :tagid', { tagid: tag_id });
    }

    if (title != null && title != '') {
      find = find.where('a.title like :title', {
        title: '%' + title + '%',
      });
    }

    return await find
      .limit(limit)
      .offset(limit * (page - 1))
      .getMany();
  }

  async details(options: PostsDetailsDto, token: string) {
    const { postId, limit = 20, page = 1 } = options;
    if (postId === undefined || postId === null) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    const p = await this.XdetailedRepository.findOne({
      relations: ['posts', 'comments'],
      where: {
        posts: postId,
      },
    });

    let comments = [];
    if (p) {
      comments = await this.xcommentsEntity.find({
        relations: ['images', 'user'],
        where: {
          posts: p.detailedId,
        },
        take: limit,
        skip: limit * (page - 1),
      });
      p.comments = comments;
    }

    const find = await this.xarticleRepository.findOne({
      relations: ['user', 'images'],
      where: {
        postID: postId,
      },
    });
    p.posts = find;

    const decryptToken = this.jwtService.verify(token);

    await this.history({
      postIds: [postId],
      userId: decryptToken.sub,
      status: PostsHistoryStatus.create,
    });

    return p;
  }

  async addPraise(options: PostsPraiseDto) {
    const { postId, userId, status } = options;
    const p = await this.xpraiseRepository.findOne({
      where: {
        posts: postId,
        user: userId,
      },
    });

    if (p && status === PostsPraiseStatus.create) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '已经点赞过了,请勿重复点赞',
      });
    }

    const post = await this.xarticleRepository.findOne({
      relations: ['user'],
      where: {
        postID: postId,
      },
    });

    if (status === PostsPraiseStatus.create) {
      const praise = new XpraiseEntity();

      const user = await this.xuserRepository.findOne({
        where: {
          userID: userId,
        },
      });
      praise.posts = post;
      praise.user = user;
      praise.createTime = Date.now();

      await getConnection()
        .createQueryBuilder()
        .update(XarticleEntity)
        .set({
          praise: post.praise + 1,
          activeTime: Date.now(),
        })
        .where('postID = :postID', { postID: postId })
        .execute();

      const isStatus = await this.xpraiseRepository.save(praise);
      return isStatus;
    } else {
      const p = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(XpraiseEntity)
        .where('posts = :posts', { posts: postId })
        .andWhere('user = :user', { user: userId })
        .execute();

      await getConnection()
        .createQueryBuilder()
        .update(XarticleEntity)
        .set({
          praise: post.praise - 1,
          activeTime: Date.now(),
        })
        .where('postID = :postID', { postID: postId })
        .execute();

      return p.affected;
    }
  }

  async deletePraise(options: PostsRemovePraiseDto) {
    const { userId, praiseIds, arrDelete } = options;

    let where = {};
    if (praiseIds) {
      where = options.praiseIds.map((b) => {
        return {
          praiseId: b,
        };
      });
    }

    // 全部删除
    if (
      arrDelete != null &&
      arrDelete != undefined &&
      arrDelete === PostsPraiseDeleteArrStatus.arr
    ) {
      where = {
        user: userId,
      };
    }

    if (Object.keys(where).length === 0) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    // 删除记录
    const xpraise = await this.xpraiseRepository.find({
      where: where,
    });
    return await this.xpraiseRepository.remove(xpraise);
  }

  async deleteCollection(options: PostsDeleteCollectionDto) {
    const { userId, collectionIds, arrDelete } = options;

    let where = {};
    if (collectionIds) {
      where = options.collectionIds.map((b) => {
        return {
          collectionId: b,
        };
      });
    }

    // 全部删除
    if (
      arrDelete != null &&
      arrDelete != undefined &&
      arrDelete === PostsPraiseDeleteArrStatus.arr
    ) {
      where = {
        user: userId,
      };
    }

    if (Object.keys(where).length === 0) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    // 删除记录
    const xcollection = await this.xcollectionEntity.find({
      where: where,
    });
    return await this.xcollectionEntity.remove(xcollection);
  }

  async queryUserPraiseList(options: PostsUserCollectionDto) {
    const { userId, title, limit, page } = options;

    let queryForm = {
      relations: ['posts', 'user'],
      take: limit,
      skip: limit * (page - 1),
    };

    let where = {
      user: userId,
    };

    if (title != null && title != '') {
      where = Object.assign(where, {
        title: Like(`${title}%`),
      });
    }

    queryForm = Object.assign(queryForm, {
      where,
      order: {
        createTime: 'DESC',
      },
    });

    const p = await this.xpraiseRepository.find(queryForm);
    return p;
  }

  async queryUserPraiseOne(options: PostsUserCollectionOneDto) {
    const { userId, postId } = options;
    const p = await this.xpraiseRepository.findOne({
      relations: ['posts', 'user'],
      where: {
        user: userId,
        posts: postId,
      },
    });
    return p;
  }

  async collection(options: PostsCollectionDto) {
    const { postId, userId, status } = options;

    const p = await this.xcollectionEntity.findOne({
      where: {
        posts: postId,
        user: userId,
      },
    });

    if (p && status === PostsCollectionStatus.create) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '已经收藏过了,请勿重复收藏',
      });
    }

    if (status === PostsCollectionStatus.create) {
      const collection = new XcollectionEntity();

      const post = await this.xarticleRepository.findOne({
        relations: ['user'],
        where: {
          postID: postId,
        },
      });

      const user = await this.xuserRepository.findOne({
        where: {
          userID: userId,
        },
      });
      collection.posts = post;
      collection.user = user;
      collection.createTime = Date.now();

      const isStatus = await this.xcollectionEntity.save(collection);
      return isStatus;
    } else {
      const p = await getConnection()
        .createQueryBuilder()
        .delete()
        .from(XcollectionEntity)
        .where('posts = :posts', { posts: postId })
        .andWhere('user = :user', { user: userId })
        .execute();
      return p.affected;
    }
  }

  async queryUserCollectionList(options: PostsUserCollectionDto) {
    const { userId, title, limit, page } = options;

    let queryForm = {
      relations: ['posts', 'user'],
      take: limit,
      skip: limit * (page - 1),
    };

    let where = {
      user: userId,
    };

    if (title != null && title != '') {
      where = Object.assign(where, {
        title: Like(`${title}%`),
      });
    }

    queryForm = Object.assign(queryForm, {
      where,
      order: {
        createTime: 'DESC',
      },
    });

    const p = await this.xcollectionEntity.find(queryForm);

    return p;
  }

  async queryUserCollectionOne(options: PostsUserCollectionOneDto) {
    const { userId, postId } = options;
    const p = await this.xcollectionEntity.findOne({
      relations: ['posts', 'user'],
      where: {
        user: userId,
        posts: postId,
      },
    });
    return p;
  }

  async getArticleCarouselMap(): Promise<XarticleEntity[]> {
    const queryForm = {
      relations: ['user', 'images'],
      where: {
        recommendationLevel: 1,
      },
    };
    const find = await this.xarticleRepository.find(queryForm);
    return find;
  }

  async createPostsComment(options: PostsCommentDto) {
    const { postId, userId, text } = options;

    const user = await this.xuserRepository.findOne({
      where: {
        userID: userId,
      },
    });

    const posts = await this.XdetailedRepository.findOne({
      relations: ['posts', 'comments'],
      where: {
        posts: postId,
      },
    });

    if (user == null || posts == null) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    const comments = new XcommentsEntity();
    comments.user = user;
    comments.posts = posts;
    comments.text = text;
    comments.createTime = Date.now();

    const res = await this.xcommentsEntity.save(comments);

    return res;
  }

  async history(options: PostsHistorytDto) {
    const { userId, postIds, status } = options;

    if (status === PostsHistoryStatus.create) {
      const find = await this.xarticleRepository.findOne({
        relations: ['user', 'images'],
        where: {
          postID: postIds[0],
        },
      });

      const user = await this.xuserRepository.findOne({
        where: {
          userID: userId,
        },
      });

      // 浏览记录增加
      await getConnection()
        .createQueryBuilder()
        .update(XarticleEntity)
        .set({ hit: find.hit + 1 })
        .where('postID = :postID', { postID: postIds[0] })
        .execute();

      // 历史库表是否存在当前记录
      const _xhistory = await this.xhistoryRepository.findOne({
        where: {
          posts: postIds[0],
          user: userId,
        },
      });

      // 存在, 更新时间
      if (_xhistory) {
        _xhistory.createTime = Date.now();
        return await this.xhistoryRepository.save(_xhistory);
      }

      // 浏览历史入库
      const xhistory = new Xhistory();
      xhistory.posts = find;
      xhistory.user = user;
      xhistory.createTime = Date.now();
      return await this.xhistoryRepository.save(xhistory);
    } else {
      let where = {};
      if (options.historyIDs) {
        where = options.historyIDs.map((b) => {
          return {
            historyID: b,
          };
        });
      }

      // 全部删除
      if (
        options.arrDelete != null &&
        options.arrDelete != undefined &&
        options.arrDelete === PostsHistoryDeleteArrStatus.arr
      ) {
        where = {
          user: userId,
        };
      }

      if (Object.keys(where).length === 0) {
        throw new ForbiddenException({
          code: HttpStatus.UNAUTHORIZED,
          message: '参数异常',
        });
      }

      // 删除记录
      const xhistory = await this.xhistoryRepository.find({
        where: where,
      });
      return await this.xhistoryRepository.remove(xhistory);
    }
  }

  async queryHistoryList(options: PostsHistoryListtDto) {
    const { userId, limit, page } = options;

    let queryForm = {
      relations: ['posts', 'user'],
      take: limit,
      skip: limit * (page - 1),
      where: {
        user: userId,
      },
    };

    queryForm = Object.assign(queryForm, {
      order: {
        createTime: 'DESC',
      },
    });

    return await this.xhistoryRepository.find(queryForm);
  }
}
