import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(XuserEntity)
    private readonly xuserRepository: Repository<XuserEntity>,
  ) {}

  async login(user: UserDto): Promise<any> {
    const payload = { username: user.username, sub: user.password };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateUser(params: UserDto): Promise<any> {
    const { password, username } = params;
    const p = await this.xuserRepository.find({
      where: {
        password,
        username,
      },
    });
    return p;
  }
}
