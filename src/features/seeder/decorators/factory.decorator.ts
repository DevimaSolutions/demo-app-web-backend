import { FactoryMetadataStorage, IFactoryValue, IFactoryValueGenerator } from '@/features/seeder';

export function Factory(arg: IFactoryValueGenerator | IFactoryValue) {
  return (target: Record<string, any>, propertyKey: string | symbol): void => {
    FactoryMetadataStorage.addPropertyMetadata({
      target: target.constructor,
      propertyKey: propertyKey as string,
      arg,
    });
  };
}
