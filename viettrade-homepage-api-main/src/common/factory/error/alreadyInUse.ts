import { CONFLICT } from 'http-status';

import ErrorCode from './_errorCode';
import BWError from './error';

/**
 * AlreadyInUseError
 */
export default class AlreadyInUseError extends BWError {
  public readonly entityName: string;
  public readonly fieldNames: string[];

  constructor(entityName: string, fieldNames: string[], message?: string) {
    let actualMessage = message;
    if (message === undefined || message.length === 0) {
      actualMessage = `The specified '${entityName}' value is already in use for: ${fieldNames.join(
        ', '
      )}.`;
    }

    super(ErrorCode.AlreadyInUse, actualMessage, CONFLICT);

    this.entityName = entityName;
    this.fieldNames = fieldNames;

    Object.assign(this, AlreadyInUseError.prototype);
  }
}
