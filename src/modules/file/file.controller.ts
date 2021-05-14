import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiHeader,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { FileUploadDto } from './dto/file.upload.dto';

@ApiBearerAuth()
@ApiTags('file')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'token',
    description: 'Auth token',
  })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @ApiOperation({
    summary: '用户头像上传',
  })
  @Post('/uploadFile')
  async uploadFile(
    @Body() request: FileUploadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.fileService.uploadFile({
      userID: request.userID,
      file,
    });
  }

  @ApiOperation({
    summary: '头像预览',
  })
  @Get('/images/:path')
  async previewImage(@Param() { path }, @Res() res: Response) {
    const content = await this.fileService.previewImage(path);
    res.write(content, 'binary');
    res.end();
    return res;
  }
}
