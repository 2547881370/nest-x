import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { XupdateAppEntity } from 'src/tasks/x/entity/XupdateApp.entity';
import { updateAppDto } from './dto/update-app.dto';
import { UpdateAppService } from './update-app.service';

@ApiTags('updateApp')
@Controller('updateApp')
export class UpdateAppController {
  constructor(private readonly updateAppService: UpdateAppService) {}

  @Post('/createUpdateApp')
  async createUpdateApp(@Body() request: updateAppDto): Promise<any> {
    return this.updateAppService.createUpdateApp(request);
  }

  @Post('/getUpdateApp')
  async getUpdateApp() {
    return this.updateAppService.getUpdateApp();
  }

  @Post('/removeUpdateApp')
  async removeUpdateApp() {
    return this.updateAppService.removeUpdateApp();
  }
}
