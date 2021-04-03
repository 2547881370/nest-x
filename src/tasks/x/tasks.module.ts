import { XcommentsEntity } from './entity/Xcomments.entity';
import { HttpModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { XuserEntity } from './entity/Xuser.entity';
import { XarticleEntity } from './entity/Xarticle.entity';
import { XimageEntity } from './entity/Ximage.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XdetailedEntity } from './entity/Xdetailed.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      XuserEntity,
      XarticleEntity,
      XimageEntity,
      XdetailedEntity,
      XcommentsEntity,
    ]),
    HttpModule,
  ],
  providers: [TasksService],
})
export class TasksModule {}
