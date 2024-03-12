import { ISeederModuleOptions } from '@/features/seeder/interfaces';
import { HasherService, UsersSeeder } from '@/features/users';

export const seederConfig: ISeederModuleOptions = {
  providers: [HasherService],
  seeders: [UsersSeeder],
};
