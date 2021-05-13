import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XarticleEntity } from 'src/tasks/x/entity/Xarticle.entity';
import { XdetailedEntity } from 'src/tasks/x/entity/Xdetailed.entity';
import { Repository } from 'typeorm';
import { PostsDetailsDto } from './dto/PostsDetails.dto';
import { PostsQueryDto } from './dto/PostsQuery.dto';
import { SortBy, TagId } from './enums/PostsQuery.enum';
import { ForbiddenException } from '../../common/exception/forbidden.exception';
import { XcommentsEntity } from 'src/tasks/x/entity/Xcomments.entity';
import { PostsPraiseDto } from './dto/PostsPraise.dto';
import { getConnection } from 'typeorm';
import { PostsCollectionDto } from './dto/PostsCollection.dto';
import { XcollectionEntity } from 'src/tasks/x/entity/Xcollection.entity';
import { PostsCollectionStatus } from './enums/PostsCollection.enum';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import {
  PostsUserCollectionDto,
  PostsUserCollectionOneDto,
} from './dto/PostsUserCollection.dto';
import { XpraiseEntity } from 'src/tasks/x/entity/Xpraise.entity';
import { PostsPraiseStatus } from './enums/PostsPraise.enum';

@Injectable()
export class PostsService {
  constructor(
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
  ) {}

  async list(options: PostsQueryDto) {
    // 默认以回复时间排序
    // 默认以全部进行查询
    const {
      limit = 20,
      page = 1,
      tag_id = TagId.arr,
      sort_by = SortBy.activeTime,
    } = options;

    let queryForm = {
      relations: ['user', 'images'],
      take: limit,
      skip: limit * (page - 1),
    };
    if (sort_by === SortBy.activeTime) {
      queryForm = Object.assign(queryForm, {
        order: {
          activeTime: 'DESC',
        },
      });
    } else {
      queryForm = Object.assign(queryForm, {
        order: {
          createTime: 'DESC',
        },
      });
    }

    if (tag_id !== TagId.arr) {
      queryForm = Object.assign(queryForm, {
        where: { tagid: tag_id },
      });
    }

    const find = await this.xarticleRepository.find(queryForm);

    return find;
  }

  async details(options: PostsDetailsDto) {
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

    await getConnection()
      .createQueryBuilder()
      .update(XarticleEntity)
      .set({ hit: find.hit + 1 })
      .where('postID = :postID', { postID: postId })
      .execute();

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

  async queryUserPraiseList(options: PostsUserCollectionDto) {
    const { userId } = options;
    const p = await this.xpraiseRepository.find({
      relations: ['posts', 'user'],
      where: {
        user: userId,
      },
    });
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
    const { userId } = options;
    const p = await this.xcollectionEntity.find({
      relations: ['posts', 'user'],
      where: {
        user: userId,
      },
    });
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
}
