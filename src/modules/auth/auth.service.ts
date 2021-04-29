import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { ForbiddenException } from '../../common/exception/forbidden.exception';

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

    const isHanderCreateUser = await this.xuserRepository.save(user);
    if (isHanderCreateUser) {
      return isHanderCreateUser;
    }
  }
}
