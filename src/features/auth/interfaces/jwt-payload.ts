import { UserRole } from '@/features/auth';

export interface IJwtPayload {
  email: string;
  sub: string;
  role: UserRole;
}
