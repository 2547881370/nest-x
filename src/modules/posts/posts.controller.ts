import { Body, Controller, Post } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { XarticleEntity } from 'src/tasks/x/entity/Xarticle.entity';
import { XdetailedEntity } from 'src/tasks/x/entity/Xdetailed.entity';
import { XarticleInterface } from 'src/tasks/x/interface/xarticle.interface';
import { PostsCollectionDto } from './dto/PostsCollection.dto';
import { PostsDetailsDto } from './dto/PostsDetails.dto';
import { PostsPraiseDto } from './dto/PostsPraise.dto';
import { PostsQueryDto } from './dto/PostsQuery.dto';
import { PostsUserCollectionDto } from './dto/PostsUserCollection.dto';
import { PostsDetailsEntitle } from './entities/PostsDetails.entitle';
import { PostsQueryEntitie } from './entities/PostsQuery.entitle';
import { PostsService } from './posts.service';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('/list')
  @ApiResponse({
    status: 200,
    type: PostsQueryEntitie,
  })
  async list(@Body() request: PostsQueryDto): Promise<XarticleEntity[]> {
    return this.postsService.list(request);
  }

  @Post('/details')
  @ApiResponse({
    status: 200,
    type: PostsDetailsEntitle,
  })
  async details(@Body() request: PostsDetailsDto): Promise<XdetailedEntity> {
    return this.postsService.details(request);
  }

  @Post('/praise')
  async addPraise(@Body() request: PostsPraiseDto) {
    return this.postsService.addPraise(request);
  }

  @Post('/collection')
  async collection(@Body() request: PostsCollectionDto) {
    return this.postsService.collection(request);
  }

  @Post('/queryUserCollection')
  async queryUserCollection(@Body() request: PostsUserCollectionDto) {
    return this.postsService.queryUserCollection(request);
  }
}
