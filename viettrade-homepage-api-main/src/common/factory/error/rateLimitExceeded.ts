import { TOO_MANY_REQUESTS } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * RateLimitExceededError
 */
export default class RateLimitExceededError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = 'Rate limit exceeded.';
    }

    super(ErrorCode.RateLimitExceeded, actualMessage, TOO_MANY_REQUESTS);

    Object.assign(this, RateLimitExceededError.prototype);
  }
}
