import { ApiProperty } from '@nestjs/swagger';

export class UserEntitie {
  @ApiProperty({ description: '用户名' })
  account: string;

  @ApiProperty({ description: 'token' })
  token: string;
}
