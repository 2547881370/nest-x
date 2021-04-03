import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [
    // UsersModule,
    PassportModule,
    JwtModule.register({
      // 密钥
      secret: jwtConstants.secret,
      // jwt过期时间
      // signOptions: { expiresIn: '60s' },
    }),
    TypeOrmModule.forFeature([XuserEntity]),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
