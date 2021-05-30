import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';
import { UserDto, UserInfoDto, UserNameDto } from './dto/user.dto';
import { UserEntitie } from './entities/user.entitie';

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

  @ApiOperation({
    summary: '修改昵称',
  })
  @Post('/updateUsername')
  async updateUsername(@Body() request: UserNameDto) {
    return this.authService.updateUsername(request);
  }

  @ApiOperation({
    summary: '获取用户信息',
  })
  @Post('/getUserInfo')
  async getUserInfo(@Body() request: UserInfoDto) {
    return this.authService.getUserInfo(request);
  }
}
