import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
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
}
