import { HttpException, HttpStatus } from '@nestjs/common';

export interface CustomError {
  code: HttpStatus;
  timestamp?: string;
  path?: string;
  error?: string;
  message: string;
  data?: any;
}

export class ForbiddenException<T extends CustomError> extends HttpException {
  constructor(options: T) {
    super(
      {
        ...options,
        message: options.message,
      },
      options.code,
    );
  }
}
