import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XupdateAppEntity } from 'src/tasks/x/entity/XupdateApp.entity';
import { XupdateAppContentEntity } from 'src/tasks/x/entity/XupdateAppContent.entity';
import { UpdateAppController } from './update-app.controller';
import { UpdateAppService } from './update-app.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([XupdateAppEntity, XupdateAppContentEntity]),
  ],
  controllers: [UpdateAppController],
  providers: [UpdateAppService],
})
export class UpdateAppModule {}
