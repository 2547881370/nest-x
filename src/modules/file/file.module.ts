import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XuserEntity } from 'src/tasks/x/entity/Xuser.entity';
import { jwtConstants } from '../auth/constants';
import { JwtStrategy } from '../auth/jwt.strategy';
import { FileController } from './file.controller';
import { FileService } from './file.service';

@Module({
  imports: [
    JwtModule.register({
      // 密钥
      secret: jwtConstants.secret,
    }),
    TypeOrmModule.forFeature([XuserEntity]),
  ],
  controllers: [FileController],
  providers: [FileService, JwtStrategy],
  exports: [FileService],
})
export class FileModule {}
