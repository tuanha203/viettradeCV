import { SERVICE_UNAVAILABLE } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * ServiceUnavailableError
 */
export default class ServiceUnavailableError extends BWError {
  constructor(message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = 'Service unavailable temporarily.';
    }

    super(ErrorCode.ServiceUnavailable, actualMessage, SERVICE_UNAVAILABLE);

    Object.assign(this, ServiceUnavailableError.prototype);
  }
}
