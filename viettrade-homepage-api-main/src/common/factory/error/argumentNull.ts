import { BAD_REQUEST } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * ArgumentNullError
 */
export default class ArgumentNullError extends BWError {
  public readonly argumentName: string;

  constructor(argumentName: string, message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = `Missing argument: ${argumentName}.`;
    }

    super(ErrorCode.ArgumentNull, actualMessage, BAD_REQUEST);

    this.argumentName = argumentName;

    Object.assign(this, ArgumentNullError.prototype);
  }
}
