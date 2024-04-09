import { faker } from '@faker-js/faker';
import { plainToInstance } from 'class-transformer';
import { ClassConstructor } from 'class-transformer/types/interfaces';
import { DeepPartial } from 'typeorm';

import { IFactory, IPropertyMetadata, FactoryMetadataStorage } from '@/features/seeder';

export class DataFactory {
  static createForClass<E>(target: ClassConstructor<E>): IFactory<E> {
    if (!target) {
      throw new Error(
        `Target class "${target}" passed in to the "TemplateFactory#createForClass()" method is "undefined".`,
      );
    }

    const properties = FactoryMetadataStorage<E>().getPropertyMetadataByTarget(target);

    return {
      generate: (count: number, values: DeepPartial<E> = {} as E): E[] => {
        const ret = Array<E>();
        for (let i = 0; i < count; i++) {
          ret.push(
            plainToInstance(target, this.generate<E>(properties, values), {
              ignoreDecorators: true,
            }),
          );
        }
        return ret;
      },
    };
  }

  private static generate<E>(
    properties: IPropertyMetadata<E>[],
    values: DeepPartial<E>,
  ): DeepPartial<E> {
    const ctx = { ...values };
    return properties.reduce(
      (r, p) => ({
        [p.propertyKey]: (ctx[p.propertyKey] =
          typeof p.arg === 'function' ? p.arg(faker, ctx) : p.arg),
        ...r,
      }),
      {} as DeepPartial<E>,
    );
  }
}
