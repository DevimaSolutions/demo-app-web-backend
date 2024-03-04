import { Injectable } from '@nestjs/common';
import { Command, Positional, Option } from 'nestjs-command';

import { UsersService } from './users.service';

import { createUserSchema } from '@/features/users/validations';

@Injectable()
export class UserCommand {
  constructor(private readonly usersService: UsersService) {}

  @Command({
    command: 'create:user <email> <password>',
    describe: 'create a user',
  })
  async create(
    @Positional({
      name: 'email',
      describe: 'the user email',
      type: 'string',
    })
    email: string,
    @Positional({
      name: 'password',
      describe: 'the password',
      type: 'string',
    })
    password: string,
    @Option({
      name: 'role',
      describe: 'user role (ex: 0 = "User", 1 = "Admin") default 0',
      type: 'number',
      alias: 'r',
      default: 0,
      required: false,
    })
    role: number,
    @Option({
      name: 'status',
      describe: 'user status (ex: 0 = "Pending", 1 = "Active", 2 = "Blocked") default 1',
      type: 'number',
      alias: 's',
      default: 1,
      required: false,
    })
    status: number,
  ) {
    const data = await createUserSchema.validateAsync({
      email,
      password,
      role,
      status,
      name: { first: '', last: '' },
    });
    await this.usersService.create(data);
  }
}
