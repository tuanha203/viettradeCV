import { FORBIDDEN } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * ForbiddenError
 */
export default class ForbiddenError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = 'Forbidden.';
    }

    super(ErrorCode.Forbidden, actualMessage, FORBIDDEN);

    Object.assign(this, ForbiddenError.prototype);
  }
}
