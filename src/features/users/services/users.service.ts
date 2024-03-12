import { Injectable } from '@nestjs/common';
import { Not } from 'typeorm';

import { ValidationFieldsException } from '@/exceptions';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '@/features/users/dto';
import { HasherService } from '@/features/users/services/hasher.service';
import { UsersRepository } from '@/features/users/users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository, private hasher: HasherService) {}

  async create(createUserDto: CreateUserRequest) {
    const user = await this.usersRepository.findOneBy({ email: createUserDto.email });

    if (user) {
      throw new ValidationFieldsException({ email: 'user with the same email already exist' });
    }

    const entity = this.usersRepository.create(createUserDto);
    entity.password = await this.hasher.hash(createUserDto.password);

    await this.usersRepository.save(entity);

    return new UserResponse(entity);
  }

  async findAll() {
    const users = await this.usersRepository.find();
    return users.map((user) => new UserResponse(user));
  }

  async findOne(id: string) {
    const entity = await this.usersRepository.getOne(id);

    return new UserResponse(entity);
  }

  async doesUserExist(email: string) {
    return await this.usersRepository.exist({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserRequest) {
    const entity = await this.usersRepository.getOne(id);

    if (updateUserDto.email) {
      const exist = await this.usersRepository.exist({
        where: { id: Not(id), email: updateUserDto.email },
      });

      if (exist) {
        throw new ValidationFieldsException({ email: 'user with the same email already exist' });
      }
    }

    const hashedPasswordUpdate = updateUserDto.password
      ? { password: await this.hasher.hash(updateUserDto.password) }
      : {};

    await this.usersRepository.save({
      id: entity.id,
      ...updateUserDto,
      ...hashedPasswordUpdate,
    });

    return this.findOne(id);
  }

  async remove(id: string) {
    const entity = await this.usersRepository.getOne(id);

    await this.usersRepository.remove(entity);
  }
}
