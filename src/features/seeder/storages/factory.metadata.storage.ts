import { ClassConstructor } from 'class-transformer/types/interfaces';

import { IPropertyMetadata } from '@/features/seeder';

export class FactoryMetadataStorageHost<E> {
  private properties = new Array<IPropertyMetadata<E>>();

  addPropertyMetadata(metadata: IPropertyMetadata<E>): void {
    this.properties.push(metadata);
  }

  getPropertyMetadataByTarget(target: ClassConstructor<E>): IPropertyMetadata<E>[] {
    return this.properties.filter((property) => property.target === target);
  }
}

const globalRef = global as any;
export const FactoryMetadataStorage = <E>(): FactoryMetadataStorageHost<E> =>
  globalRef.FactoryMetadataStorage ||
  (globalRef.FactoryMetadataStorage = new FactoryMetadataStorageHost());
