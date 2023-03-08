import { UNAUTHORIZED } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * UnauthorizedError
 */
export default class UnauthorizedError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = 'Unauthorized.';
    }

    super(ErrorCode.Unauthorized, actualMessage, UNAUTHORIZED);

    Object.assign(this, UnauthorizedError.prototype);
  }
}
