import { Injectable } from '@nestjs/common';
import { Command, Positional, Option } from 'nestjs-command';

import { UsersService } from './services/users.service';

import { UserRole, UserStatus } from '@/features/auth';
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
      describe: `user role (ex: ${Object.values(UserRole)}) default ${UserRole.User}`,
      type: 'string',
      alias: 'r',
      default: UserRole.User,
      required: false,
    })
    role: UserRole,
    @Option({
      name: 'status',
      describe: `user status (ex: ${Object.values(UserStatus)}) default ${UserStatus.Active}`,
      type: 'string',
      alias: 's',
      default: UserStatus.Active,
      required: false,
    })
    status: UserStatus,
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
