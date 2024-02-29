import { Request } from 'express';

import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

import { User } from '@/features/users';

export interface IRequestWithUser<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
> extends Request<P, ResBody, ReqBody, ReqQuery, Locals> {
  user: User;
}
