import { IFactoryValue, IFactoryValueGenerator } from '@/features/seeder';

export interface IPropertyMetadata {
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Function;
  propertyKey: string;
  arg: IFactoryValueGenerator | IFactoryValue;
}
