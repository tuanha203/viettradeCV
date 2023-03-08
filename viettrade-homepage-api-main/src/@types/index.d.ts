/**
 * user info will be added by authentication middleware
 * define interface of req.user
 */
import { types } from '../common';
import { initialize } from '../domain';

type db = ReturnType<typeof initialize>;

declare global {
  namespace Express {
    interface User extends types.auth.UserInfo {}
  }

  type SQLize = db;
}
