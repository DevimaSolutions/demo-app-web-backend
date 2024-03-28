import { SetMetadata } from '@nestjs/common';

import { UserStatus } from '@/features/auth';

export const STATUS_KEY = 'statuses';

/**
 * Allow access to resources only for users with statuses passed to parameters
 * @param statuses list of users' statuses that are allowed to execute decorated action
 */
export const Status = (statuses: UserStatus[]) => {
  return SetMetadata(STATUS_KEY, statuses.length ? statuses : [UserStatus.Active]);
};
