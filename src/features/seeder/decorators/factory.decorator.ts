import { DeepPartial } from 'typeorm';

import { FactoryMetadataStorage, IFactoryValue, IFactoryValueGenerator } from '@/features/seeder';

export function Factory<E>(arg: IFactoryValueGenerator<E> | IFactoryValue) {
  return (target: Record<string, any>, propertyKey: keyof DeepPartial<E>): void => {
    FactoryMetadataStorage<E>().addPropertyMetadata({
      target: target.constructor,
      propertyKey: propertyKey,
      arg,
    });
  };
}
