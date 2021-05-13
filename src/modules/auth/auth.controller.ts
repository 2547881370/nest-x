import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Header,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiHeader,
} from '@nestjs/swagger';
import { HeadersToken, UserDto } from './dto/user.dto';
import { UserEntitie } from './entities/user.entitie';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto } from './dto/file.upload.dto';
import { Express } from 'express';
import { Utils } from 'src/common/public';
import { resolve } from 'path';
import * as fs from 'fs';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiResponse({
    status: 200,
    type: UserEntitie,
  })
  login(@Body() user: UserDto) {
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('local'))
  @Post('/addUser')
  fetch(@Body() user: UserDto) {
    return this.authService.createUser(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'token',
    description: 'Auth token',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of cats',
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '用户头像上传',
  })
  @Post('/file')
  async uploadFile(
    @Body() request: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(request.userID);
    // return this.authService.uploadFile(request);
    Utils.mkdirSync('./images');
    const target_path = resolve(`./images/${file.originalname}`);
    await fs.writeFileSync(target_path, file.buffer);
    return {
      file: file.buffer.toString(),
    };
  }

  @ApiOperation({
    summary: '修改昵称',
  })
  @Post('/updateUsername')
  async updateUsername(@Body() request) {
    // return this.authService.updateFile(request);
  }
}
