import { Faker } from '@faker-js/faker';

export type IBaseType = string | number | Date | Buffer | boolean | Record<string, any>;
export type IFactoryValue = IBaseType | Array<IBaseType>;
export type IFactoryValueGenerator = (faker?: Faker, ctx?: Record<string, any>) => IFactoryValue;
export interface IFactory {
  generate(count: number, values?: Record<string, any>): Record<string, IFactoryValue>[];
}
