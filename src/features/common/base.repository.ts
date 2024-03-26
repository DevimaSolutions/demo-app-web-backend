import { getNamespace } from 'cls-hooked';
import {
  DataSource,
  EntityManager,
  EntityTarget,
  FindManyOptions,
  ObjectLiteral,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { runInNewHookContext } from './cls-hooks';
import { PaginationResponse } from './dto';
import { IPaginationOptions } from './interfaces';
import { ITransactionOptions, Propagation } from './transaction.types';
import {
  NAMESPACE_NAME,
  getEntityManager,
  patchRepositoryManager,
  setEntityManager,
} from './transaction.util';
import { TransactionalError } from './transactional-error';

export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  private DEFAULT_LIMIT = 10;
  private DEFAULT_PAGE = 1;

  constructor(target: EntityTarget<Entity>, protected dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }

  async paginate<EntityTransform>(
    options?: IPaginationOptions<Entity, EntityTransform>,
    searchOptions?: FindManyOptions<Entity> | FindOptionsWhere<Entity>,
  ): Promise<PaginationResponse<Entity, EntityTransform>> {
    const page = this.resolveNumericOption(options?.page, this.DEFAULT_PAGE);
    const limit = this.resolveNumericOption(options?.limit, this.DEFAULT_LIMIT);

    let items: Entity[] = [];
    let total = 0;

    if (page < 1) {
      return new PaginationResponse({
        items,
        total,
        page,
        limit,
        transformer: options?.transformer,
      });
    }

    [items, total] = await this.findAndCount({
      skip: limit * (page - 1),
      take: limit,
      ...searchOptions,
    });
    return new PaginationResponse({ items, total, page, limit, transformer: options?.transformer });
  }

  async paginateQueryBuilder<EntityTransform>(
    queryBuilder: SelectQueryBuilder<Entity>,
    options: IPaginationOptions<Entity, EntityTransform>,
  ): Promise<PaginationResponse<Entity, EntityTransform>> {
    const page = this.resolveNumericOption(options?.page, this.DEFAULT_PAGE);
    const limit = this.resolveNumericOption(options?.limit, this.DEFAULT_LIMIT);

    const promises: [Promise<Entity[]>, Promise<number> | number] = [
      queryBuilder
        .limit(limit)
        .offset((page - 1) * limit)
        .getMany(),
      this.countQuery(queryBuilder),
    ];

    const [items, total] = await Promise.all(promises);
    return new PaginationResponse({
      items,
      total,
      page,
      limit,
      transformer: options?.transformer,
    });
  }

  async countQuery(queryBuilder: SelectQueryBuilder<Entity>): Promise<number> {
    const totalQueryBuilder = queryBuilder.clone();
    totalQueryBuilder.skip(undefined).limit(undefined).offset(undefined).take(undefined).orderBy();
    return await totalQueryBuilder.getCount();
  }

  private resolveNumericOption(value: string | number | undefined, defaultValue: number): number {
    const resolvedValue = Number(value);
    if (Number.isInteger(resolvedValue) && resolvedValue >= 0) return resolvedValue;
    return defaultValue;
  }

  /**
   * Execute all underlying code inside a single transaction using cls-hooked namespaces
   * @param transactionScopedFn the function that will execute in a shared transaction context
   * @param options transaction options @see {@link ITransactionOptions}
   * @returns returns result of `transactionScopedFn` call
   */
  useTransaction = async <TResult>(
    transactionScopedFn: () => Promise<TResult>,
    options?: ITransactionOptions,
  ): Promise<TResult> => {
    const context = getNamespace(NAMESPACE_NAME);
    if (!context) {
      throw new Error(
        'No CLS namespace defined in your app... please call initializeTransactionalContext() before application start.',
      );
    }

    const propagation = options?.propagation ?? Propagation.REQUIRED;
    // Use default isolation level provided by DB if not specified
    const isolationLevel = options && options.isolationLevel;
    const isCurrentTransactionActive = this.queryRunner?.isTransactionActive;

    const operationId = String(new Date().getTime());
    const logger = this.dataSource.logger;
    const log = (message: string) =>
      logger.log(
        'log',
        `useTransaction@${operationId}|${isolationLevel}|${propagation} - ${message}`,
      );

    log(`Before starting: isCurrentTransactionActive = ${isCurrentTransactionActive}`);

    const runOriginal = transactionScopedFn;
    const runWithNewHook = () =>
      runInNewHookContext(context, transactionScopedFn) as Promise<TResult>;

    const runWithNewTransaction = async () => {
      const transactionCallback = async (entityManager: EntityManager) => {
        log(
          `runWithNewTransaction - set entityManager in context: isCurrentTransactionActive: ${entityManager?.queryRunner?.isTransactionActive}`,
        );
        setEntityManager(context, entityManager);
        try {
          const result = await transactionScopedFn();
          log(`runWithNewTransaction - Success`);
          return result;
        } catch (e) {
          log(`runWithNewTransaction - ERROR|${e}`);
          throw e;
        } finally {
          log(`runWithNewTransaction - reset entityManager in context`);
          setEntityManager(context, null);
        }
      };

      if (isolationLevel) {
        return (await runInNewHookContext(context, () =>
          this.manager.transaction(isolationLevel, transactionCallback),
        )) as TResult;
      } else {
        return (await runInNewHookContext(context, () =>
          this.manager.transaction(transactionCallback),
        )) as TResult;
      }
    };

    return context.runAndReturn(async () => {
      const currentTransaction = getEntityManager(context);

      switch (propagation) {
        case Propagation.MANDATORY:
          if (!currentTransaction) {
            throw new TransactionalError(
              "No existing transaction found for transaction marked with propagation 'MANDATORY'",
            );
          }
          return runOriginal();
        case Propagation.NESTED:
          return runWithNewTransaction();
        case Propagation.NEVER:
          if (currentTransaction) {
            throw new TransactionalError(
              "Found an existing transaction, transaction marked with propagation 'NEVER'",
            );
          }
          return runWithNewHook();
        case Propagation.NOT_SUPPORTED:
          if (currentTransaction) {
            setEntityManager(context, null);
            const result = await runWithNewHook();
            setEntityManager(context, currentTransaction);
            return result;
          }
          return runOriginal();
        case Propagation.REQUIRED:
          if (currentTransaction) {
            return runOriginal();
          }
          return runWithNewTransaction();
        case Propagation.REQUIRES_NEW:
          return runWithNewTransaction();
        case Propagation.SUPPORTS:
          if (currentTransaction) {
            return runOriginal();
          } else {
            return runWithNewHook();
          }
      }
    });
  };
}

patchRepositoryManager(BaseRepository.prototype);
