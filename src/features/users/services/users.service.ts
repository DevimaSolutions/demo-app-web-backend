import { Injectable } from '@nestjs/common';

import { ValidationFieldsException } from '@/exceptions';
import { errorMessages } from '@/features/common';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserPaginateQuery,
  UserResponse,
} from '@/features/users/dto';
import { UsersRepository } from '@/features/users/repositoies/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async create(request: CreateUserRequest) {
    const data = await this.validateUnique(request);
    const user = await this.usersRepository.save(data);
    return new UserResponse(user);
  }

  async findAllPaginate(query: UserPaginateQuery) {
    return await this.usersRepository.findAllPaginate(query);
  }

  async findAllWithFriendshipsAndPagination(query: UserPaginateQuery, userId: string) {
    return await this.usersRepository.findAllWithFriendshipsAndPagination(query, userId);
  }

  async findOne(id: string) {
    const entity = await this.usersRepository.getOne(id);

    return new UserResponse(entity);
  }

  async doesUserExist(email: string) {
    return await this.usersRepository.exist({ where: { email } });
  }

  async update(id: string, request: UpdateUserRequest) {
    const entity = await this.usersRepository.getOne(id);

    const data = await this.validateUnique(request, entity.id);

    await this.usersRepository.update(entity.id, data);
    const user = await this.usersRepository.getOne(entity.id);
    return new UserResponse(user);
  }

  async remove(id: string) {
    const entity = await this.usersRepository.getOne(id);

    await this.usersRepository.softRemove(entity);
  }

  private async validateUnique(
    request: UpdateUserRequest | CreateUserRequest,
    id: string | undefined = undefined,
  ) {
    const data = await request.getData();

    if (data.email) {
      const exist = await this.usersRepository.existByEmail(data.email, id);
      if (exist) {
        throw new ValidationFieldsException({ email: errorMessages.userExists });
      }
    }

    if (data.nickname) {
      const exist = await this.usersRepository.existByNickname(data.nickname, id);
      if (exist) {
        throw new ValidationFieldsException({ nickname: errorMessages.userNicknameExists });
      }
    }

    return data;
  }
}
