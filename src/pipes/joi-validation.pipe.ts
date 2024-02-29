import { PipeTransform, Injectable } from '@nestjs/common';
import { ObjectSchema, ValidationOptions } from 'joi';

import { ValidationBadRequestException } from '@/exceptions';

@Injectable()
export class JoiValidationPipe<T> implements PipeTransform {
  constructor(private schema: ObjectSchema<T>, private options?: ValidationOptions) {}

  transform(value: T) {
    const { error } = this.schema.validate(value, this.options);
    if (error) {
      throw new ValidationBadRequestException(error, 'Validation failed');
    }
    return value;
  }
}
