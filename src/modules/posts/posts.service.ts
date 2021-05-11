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
import { PostsUserCollectionDto } from './dto/PostsUserCollection.dto';

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
    const { postId, count } = options;

    const article = await this.xarticleRepository.findOne({
      relations: ['user'],
      where: {
        postID: postId,
      },
    });

    if (!article) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    const p = await getConnection()
      .createQueryBuilder()
      .update(XarticleEntity)
      .set({
        praise: article.praise + count,
        activeTime: Date.now(),
      })
      .where('postID = :postID', { postID: postId })
      .execute();

    return p.affected;
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

  async queryUserCollection(options: PostsUserCollectionDto) {
    const { userId } = options;
    const p = await this.xcollectionEntity.find({
      relations: ['posts', 'user'],
      where: {
        user: userId,
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
