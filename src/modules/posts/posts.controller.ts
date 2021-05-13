import { Body, Controller, Get, Post } from '@nestjs/common';
import * as Swagger from '@nestjs/swagger';
import { XarticleEntity } from 'src/tasks/x/entity/Xarticle.entity';
import { XdetailedEntity } from 'src/tasks/x/entity/Xdetailed.entity';
import { XarticleInterface } from 'src/tasks/x/interface/xarticle.interface';
import { PostsCollectionDto } from './dto/PostsCollection.dto';
import { PostsDetailsDto } from './dto/PostsDetails.dto';
import { PostsPraiseDto } from './dto/PostsPraise.dto';
import { PostsQueryDto } from './dto/PostsQuery.dto';
import {
  PostsUserCollectionDto,
  PostsUserCollectionOneDto,
} from './dto/PostsUserCollection.dto';
import { PostsDetailsEntitle } from './entities/PostsDetails.entitle';
import { PostsQueryEntitie } from './entities/PostsQuery.entitle';
import { PostsService } from './posts.service';

@Swagger.ApiBearerAuth()
@Swagger.ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/list')
  @Swagger.ApiResponse({
    status: 200,
    type: PostsQueryEntitie,
  })
  async list(@Body() request: PostsQueryDto): Promise<XarticleEntity[]> {
    return this.postsService.list(request);
  }

  @Post('/details')
  @Swagger.ApiResponse({
    status: 200,
    type: PostsDetailsEntitle,
  })
  async details(@Body() request: PostsDetailsDto): Promise<XdetailedEntity> {
    return this.postsService.details(request);
  }

  @Swagger.ApiOperation({
    summary: '用户点赞',
  })
  @Post('/praise')
  async addPraise(@Body() request: PostsPraiseDto) {
    return this.postsService.addPraise(request);
  }

  @Swagger.ApiOperation({
    summary: '获取用户点赞列表',
  })
  @Post('/queryUserPraiseList')
  async queryUserPraiseList(@Body() request: PostsUserCollectionDto) {
    return this.postsService.queryUserPraiseList(request);
  }

  @Swagger.ApiOperation({
    summary: '文章是否被用户点赞',
  })
  @Post('/queryUserPraiseOne')
  async queryUserPraiseOne(@Body() request: PostsUserCollectionOneDto) {
    return this.postsService.queryUserPraiseOne(request);
  }

  @Swagger.ApiOperation({
    summary: '用户收藏',
  })
  @Post('/collection')
  async collection(@Body() request: PostsCollectionDto) {
    return this.postsService.collection(request);
  }

  @Swagger.ApiOperation({
    summary: '获取用户收藏列表',
  })
  @Post('/queryUserCollectionList')
  async queryUserCollectionList(@Body() request: PostsUserCollectionDto) {
    return this.postsService.queryUserCollectionList(request);
  }

  @Swagger.ApiOperation({
    summary: '文章是否被用户收藏',
  })
  @Post('/queryUserCollectionOne')
  async queryUserCollectionOne(@Body() request: PostsUserCollectionOneDto) {
    return this.postsService.queryUserCollectionOne(request);
  }

  @Swagger.ApiOperation({
    summary: '轮播图',
  })
  @Get('/getArticleCarouselMap')
  async getArticleCarouselMap(): Promise<XarticleEntity[]> {
    return this.postsService.getArticleCarouselMap();
  }
}
