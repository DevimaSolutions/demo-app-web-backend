import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Not } from 'typeorm';

import { CreateUserRequest, UpdateUserRequest, UserResponse } from './dto';
import { UsersRepository } from './users.repository';

import { ValidationFieldsException } from '@/exceptions';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  private cryptPass = (password: string) => bcrypt.hash(password, bcrypt.genSaltSync());

  async create(createUserDto: CreateUserRequest) {
    const user = await this.usersRepository.findOneBy({ email: createUserDto.email });

    if (user) {
      throw new ValidationFieldsException({ email: 'user with the same email already exist' });
    }

    const entity = this.usersRepository.create(createUserDto);
    entity.password = await this.cryptPass(createUserDto.password);

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

  async findByEmail(email: string) {
    const entity = await this.usersRepository.findOneBy({ email });

    if (!entity) {
      throw new NotFoundException();
    }

    return entity;
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
      ? { password: await this.cryptPass(updateUserDto.password) }
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
