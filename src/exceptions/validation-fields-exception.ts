import { BadRequestException, HttpStatus } from '@nestjs/common';

export class ValidationFieldsException extends BadRequestException {
  constructor(
    errors: Record<string, string>,
    message = 'Validation Failed',
    description = 'Bad Request',
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ statusCode, message, error: description, errors });
  }
}
