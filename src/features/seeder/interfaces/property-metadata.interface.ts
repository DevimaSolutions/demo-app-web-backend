import { DeepPartial, EntitySchema, ObjectType } from 'typeorm';

import { IFactoryValue, IFactoryValueGenerator } from '@/features/seeder';
export interface IPropertyMetadata<E> {
  arg: IFactoryValueGenerator<E> | IFactoryValue;
  propertyKey: keyof DeepPartial<E>;
  target: ObjectType<E> | EntitySchema<E>;
}
