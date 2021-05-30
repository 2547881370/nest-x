import { IsNumber, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  readonly username: string;

  @IsString()
  readonly password: string;
}

export class HeadersToken {
  @IsString()
  token: string;
}

export class UserNameDto {
  @IsString()
  readonly username: string;

  @IsNumber()
  readonly userID: number;
}

export class UserInfoDto {
  @IsNumber()
  readonly userID: number;
}
