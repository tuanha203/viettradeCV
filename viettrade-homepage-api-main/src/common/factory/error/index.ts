/**
 * errors
 */
import AlreadyInUseError from './alreadyInUse';
import ArgumentError from './argument';
import ArgumentNullError from './argumentNull';
import BWError from './error';
import ForbiddenError from './forbidden';
import Info from './info';
import NotFoundError from './notFound';
import NotImplementedError from './notImplemented';
import RateLimitExceededError from './rateLimitExceeded';
import ServiceUnavailableError from './serviceUnavailable';
import UnauthorizedError from './unauthorized';

export {
  AlreadyInUseError as AlreadyInUse,
  ArgumentError as Argument,
  ArgumentNullError as ArgumentNull,
  ForbiddenError as Forbidden,
  NotFoundError as NotFound,
  NotImplementedError as NotImplemented,
  RateLimitExceededError as RateLimitExceeded,
  ServiceUnavailableError as ServiceUnavailable,
  BWError as Error,
  UnauthorizedError as Unauthorized,
  Info
};
