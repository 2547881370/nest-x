import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XarticleEntity } from 'src/tasks/x/entity/Xarticle.entity';
import { XcollectionEntity } from 'src/tasks/x/entity/Xcollection.entity';
import { XcommentsEntity } from 'src/tasks/x/entity/Xcomments.entity';
import { XdetailedEntity } from 'src/tasks/x/entity/Xdetailed.entity';
import { Xhistory } from 'src/tasks/x/entity/Xhistory.entity';
import { XimageEntity } from 'src/tasks/x/entity/Ximage.entity';
import { XpraiseEntity } from 'src/tasks/x/entity/Xpraise.entity';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { jwtConstants } from '../auth/constants';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [
    JwtModule.register({
      // 密钥
      secret: jwtConstants.secret,
    }),
    TypeOrmModule.forFeature([
      XuserEntity,
      XarticleEntity,
      XimageEntity,
      XdetailedEntity,
      XcommentsEntity,
      XcollectionEntity,
      XpraiseEntity,
      Xhistory,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
