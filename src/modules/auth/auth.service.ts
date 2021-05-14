import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { Repository } from 'typeorm';
import { UserDto, UserNameDto } from './dto/user.dto';
import { ForbiddenException } from '../../common/exception/forbidden.exception';
import { FileUploadDto } from '../file/dto/file.upload.dto';

type CreateUserType = XuserEntity;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(XuserEntity)
    private readonly xuserRepository: Repository<XuserEntity>,
  ) {}

  async login(user: UserDto): Promise<any> {
    const payload = { username: user.username, sub: user.password };

    if (!user.password || !user.username) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    const p = await this.xuserRepository.findOne({
      where: {
        password: user.password,
        username: user.username,
      },
    });

    if (!p) {
      throw new ForbiddenException({
        code: HttpStatus.CONFLICT,
        message: '无效用户',
      });
    }

    return {
      token: this.jwtService.sign(payload),
      ...p,
    };
  }

  async validateUser(params: UserDto): Promise<any> {
    const { password, username } = params;
    if (!password || !username) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }

    const p = await this.xuserRepository.find({
      where: {
        password,
        username,
      },
    });

    return p;
  }

  async createUser(params: UserDto): Promise<CreateUserType> {
    const { password, username } = params;
    if (!password || !username) {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }
    const p = await this.xuserRepository.findOne({
      where: {
        password,
        username,
      },
    });
    if (p) {
      throw new ForbiddenException({
        code: HttpStatus.CONFLICT,
        message: '用户已存在',
      });
    }
    const user = new XuserEntity();
    user.password = password;
    user.username = username;
    user.age = 0;
    user.avatar = 'https://www.hualigs.cn/image/608b6afb4f20d.jpg';
    user.nick = '';
    user.gender = 0;
    user.integralNick = '';
    user.uuid = 0;
    user.integral = 0;
    user.levelColor = '';
    user.level = 0;
    user.identityColor = 0;
    user.identityTitle = '';
    user.credits = 0;
    user.experience = 0;
    user.role = 0;

    const isHanderCreateUser = await this.xuserRepository.save(user);
    if (isHanderCreateUser) {
      return isHanderCreateUser;
    }
  }

  async updateUsername(options: UserNameDto) {
    const { username, userID } = options;

    const user = await this.xuserRepository.findOne({
      where: {
        userID,
      },
    });
    if (user) {
      user.username = username;
      return this.xuserRepository.save(user);
    } else {
      throw new ForbiddenException({
        code: HttpStatus.UNAUTHORIZED,
        message: '参数异常',
      });
    }
  }
}
