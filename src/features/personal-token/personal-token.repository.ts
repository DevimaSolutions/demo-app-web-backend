import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, MoreThan, ArrayContains } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { BaseRepository } from '@/features/common/base.repository';
import { PersonalToken } from '@/features/personal-token/entities';
import { TokenScope } from '@/features/personal-token/enums';

@Injectable()
export class PersonalTokenRepository extends BaseRepository<PersonalToken> {
  constructor(dataSource: DataSource) {
    super(PersonalToken, dataSource);
  }

  async getOneBy(where: FindOptionsWhere<PersonalToken>) {
    const entity = await this.findOneBy(where);

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async getOne(id: string) {
    const entity = await this.findOneBy({ id });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async findForUser(id: string, userId: string) {
    return await this.findOneBy({ id, user: { id: userId } });
  }

  async forUser(id: string) {
    return await this.findOneBy({ user: { id } });
  }

  async findValidTokenForUser(id: string, scopes: TokenScope[] = []) {
    return await this.findOneBy({
      user: { id },
      revoked: false,
      expiresAt: MoreThan(new Date()),
      scopes: ArrayContains(scopes),
    });
  }

  async getValidToken(id: string, scopes: TokenScope[] = []) {
    const entity = await this.findValidTokenForUser(id, scopes);
    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
  }

  async revokeToken(id: string) {
    return await this.update({ id }, { revoked: true });
  }

  async revokeUserToken(id: string) {
    return await this.update({ user: { id } }, { revoked: true });
  }

  async revokeAllUserToken(id: string, scopes: TokenScope[] = []) {
    return await this.update({ user: { id }, scopes: ArrayContains(scopes) }, { revoked: true });
  }
}
