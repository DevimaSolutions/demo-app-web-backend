import { EntitySchema, ObjectType } from 'typeorm';

import { IFactoryValue, IFactoryValueGenerator } from '@/features/seeder';
export interface IPropertyMetadata<E> {
  target: ObjectType<E> | EntitySchema<E>;
  propertyKey: string;
  arg: IFactoryValueGenerator | IFactoryValue;
}
