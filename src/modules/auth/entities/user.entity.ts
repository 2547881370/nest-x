import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({ description: '用户名' })
  account: string;

  @ApiProperty({ description: 'token' })
  token: string;
}
