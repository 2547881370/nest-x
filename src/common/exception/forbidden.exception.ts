import { HttpException, HttpStatus } from '@nestjs/common';

export interface CustomError {
  code: HttpStatus;
  timestamp?: string;
  path?: string;
  error?: string;
  msg: string;
}

export class ForbiddenException<T extends CustomError> extends HttpException {
  constructor(options: T) {
    super(
      {
        ...options,
        message: options.msg,
      },
      options.code,
    );
  }
}
