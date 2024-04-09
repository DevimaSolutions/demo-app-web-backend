import { Faker } from '@faker-js/faker';
import { DeepPartial } from 'typeorm';

export type IBaseType = string | number | Date | Buffer | boolean | Record<string, any>;
export type IFactoryValue = IBaseType | Array<IBaseType>;
export type IFactoryValueGenerator<E> = (faker: Faker, ctx: DeepPartial<E>) => IFactoryValue;
export interface IFactory<E> {
  generate(count: number, values?: DeepPartial<E>): E[];
}
