import { NOT_IMPLEMENTED } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * NotImplementedError
 */
export default class NotImplementedError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = 'Method is not yet implemented.';
    }

    super(ErrorCode.NotImplemented, actualMessage, NOT_IMPLEMENTED);

    Object.assign(this, NotImplementedError.prototype);
  }
}
