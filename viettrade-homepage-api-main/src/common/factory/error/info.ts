import { OK } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * Info object / not a actual arror
 */
export default class Info extends BWError {
  public readonly argumentName: string;

  constructor(argumentName: string, message: string) {
    const actualMessage = message;

    super(ErrorCode.Argument, actualMessage, OK);

    this.argumentName = argumentName;

    Object.assign(this, Info.prototype);
  }
}
