/**
 * エラーコード
 */

enum ErrorCode {
  AlreadyInUse = 'AlreadyInUse',
  Argument = 'Argument',
  ArgumentNull = 'ArgumentNull',
  BadRequest = 'BadRequest',
  Forbidden = 'Forbidden',
  NotFound = 'NotFound',
  NotImplemented = 'NotImplemented',
  RateLimitExceeded = 'RateLimitExceeded',
  ServiceUnavailable = 'ServiceUnavailable',
  Unauthorized = 'Unauthorized'
}

export default ErrorCode;
