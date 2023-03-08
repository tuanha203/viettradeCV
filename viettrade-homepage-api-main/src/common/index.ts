/**
 * factory
 */
import * as constant from './constant';
import * as authFactory from './factory/auth';
import * as errors from './factory/error';
import ErrorCode from './factory/error/_errorCode';
import * as types from './types';

export import errors = errors;
export import errorCode = ErrorCode;
export const messages = constant.messages;
export const validationMessages = constant.validationMessage;
export import types = types;

export namespace auth {
  export import loginParams = authFactory.ILoginParams;
  export import userInfo = authFactory.IUserInfo;
  export import contactInfo = authFactory.IContactInfo;
}
