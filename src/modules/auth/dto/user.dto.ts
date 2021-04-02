import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly account: string;

  @IsString()
  readonly pwd: string;
}
