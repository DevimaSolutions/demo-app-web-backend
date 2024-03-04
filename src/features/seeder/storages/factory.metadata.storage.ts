import { Type } from '@nestjs/common';

import { IPropertyMetadata } from '@/features/seeder';

export class FactoryMetadataStorageHost {
  private properties = new Array<IPropertyMetadata>();

  addPropertyMetadata(metadata: IPropertyMetadata): void {
    this.properties.push(metadata);
  }

  getPropertyMetadataByTarget(target: Type<unknown>): IPropertyMetadata[] {
    return this.properties.filter((property) => property.target === target);
  }
}

const globalRef = global as any;
export const FactoryMetadataStorage: FactoryMetadataStorageHost =
  globalRef.FactoryMetadataStorage ||
  (globalRef.FactoryMetadataStorage = new FactoryMetadataStorageHost());
