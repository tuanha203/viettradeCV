import { NOT_FOUND } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * NotFoundError
 */
export default class NotFoundError extends BWError {
  public readonly entityName: string;

  constructor(entityName: string, message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = `Not Found: ${entityName}.`;
    }

    super(ErrorCode.NotFound, actualMessage, NOT_FOUND);

    this.entityName = entityName;

    Object.assign(this, NotFoundError.prototype);
  }
}
