import { faker } from '@faker-js/faker';
import { Type } from '@nestjs/common';

import {
  IFactoryValue,
  IFactory,
  IPropertyMetadata,
  FactoryMetadataStorage,
} from '@/features/seeder';

export class DataFactory {
  static createForClass(target: Type<unknown>): IFactory {
    if (!target) {
      throw new Error(
        `Target class "${target}" passed in to the "TemplateFactory#createForClass()" method is "undefined".`,
      );
    }

    const properties = FactoryMetadataStorage.getPropertyMetadataByTarget(target);

    return {
      generate: (
        count: number,
        values: Record<string, any> = {},
      ): Record<string, IFactoryValue>[] => {
        const ret = Array<Record<string, IFactoryValue>>();
        for (let i = 0; i < count; i++) {
          ret.push(this.generate(properties, values));
        }
        return ret;
      },
    };
  }

  private static generate(
    properties: IPropertyMetadata[],
    values: Record<string, any>,
  ): Record<string, IFactoryValue> {
    const ctx = { ...values };
    return properties.reduce(
      (r, p) => ({
        [p.propertyKey]:
          ctx?.[p.propertyKey] ??
          (typeof p.arg === 'function' ? p.arg(faker, ctx[p.propertyKey]) : p.arg),
        ...r,
      }),
      {},
    );
  }
}
