import { BAD_REQUEST } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * ArgumentError
 */
export default class ArgumentError extends BWError {
  public readonly argumentName: string;

  constructor(argumentName: string, message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = `Invalid or missing argument supplied: ${argumentName}.`;
    }

    super(ErrorCode.Argument, actualMessage, BAD_REQUEST);

    this.argumentName = argumentName;

    Object.assign(this, ArgumentError.prototype);
  }
}
