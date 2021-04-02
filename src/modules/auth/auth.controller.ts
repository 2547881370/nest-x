import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UserEntity } from './entities/user.entity';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/login')
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  login(@Body() user: UserDto) {
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/query')
  fetch() {
    return {};
  }
}
