import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { resolve } from 'path';
import { Utils } from 'src/common/public';
import { FileUploadDto } from './dto/file.upload.dto';
import * as fs from 'fs';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import stringRandom from 'string-random';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(XuserEntity)
    private readonly xuserRepository: Repository<XuserEntity>,
  ) {}

  static _path = './dist/images';

  async uploadFile(options: FileUploadDto) {
    const { userID, file } = options;

    const user = await this.xuserRepository.findOne({
      where: { userID },
    });

    if (!user) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    const pathName = stringRandom(16) + '.' + file.mimetype.split('/')[1];

    Utils.mkdirSync(FileService._path);
    const target_path = resolve(`${FileService._path}${pathName}`);

    user.avatar = '/' + pathName;
    await this.xuserRepository.save(user);

    // 写入文件
    await fs.writeFileSync(target_path, file.buffer);
    return pathName;
  }

  async previewImage(path: string): Promise<string> {
    const target_path = resolve(`${FileService._path}${path}`);
    const content = await fs.readFileSync(target_path, 'binary');
    return content;
  }
}
