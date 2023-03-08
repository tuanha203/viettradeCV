import { messages } from '../../constant';
import ErrorCode from './_errorCode';

/**
 * Error
 */
export default class BWError extends Error {
  public readonly reason: ErrorCode | string;
  public readonly httpStatus: number;

  constructor(
    code: ErrorCode | string,
    message: string = messages.systemError,
    httpStatus: number = 500
  ) {
    super(message);

    this.name = 'Error';
    this.httpStatus = httpStatus;
    this.reason = code;
  }
}
