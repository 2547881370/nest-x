import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XupdateAppEntity } from 'src/tasks/x/entity/XupdateApp.entity';
import { XupdateAppContentEntity } from 'src/tasks/x/entity/XupdateAppContent.entity';
import { getConnection, Repository } from 'typeorm';
import { updateAppDto } from './dto/update-app.dto';

@Injectable()
export class UpdateAppService {
  constructor(
    @InjectRepository(XupdateAppEntity)
    private readonly xupdateAppEntity: Repository<XupdateAppEntity>,
    @InjectRepository(XupdateAppContentEntity)
    private readonly xupdateAppContentEntity: Repository<XupdateAppContentEntity>,
  ) {}

  async createUpdateApp(options: updateAppDto) {
    await this.removeUpdateApp();

    const { title, contents } = options;
    const updateApp = new XupdateAppEntity();
    updateApp.force = false;
    updateApp.title = title;

    const newContents = [];
    for (let index = 0; index < contents.length; index++) {
      const b = contents[index];
      const updateAppContent = new XupdateAppContentEntity();
      updateAppContent.content = b;
      updateAppContent.updateApp = updateApp;
      newContents.push(updateAppContent);
    }

    updateApp.updateAppContents = newContents;

    const p = await this.xupdateAppEntity.save(updateApp);

    return 1;
  }

  async getUpdateApp() {
    return await this.xupdateAppEntity.findOne({
      relations: ['updateAppContents'],
    });
  }

  async removeUpdateApp() {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(XupdateAppEntity)
      .execute();

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(XupdateAppContentEntity)
      .execute();

    return;
  }
}
