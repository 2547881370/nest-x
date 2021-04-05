import { ApiProperty } from '@nestjs/swagger';
export class updateAppEntitle {
  title: string;
  contents: string;
  force: boolean;
}
