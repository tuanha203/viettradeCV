import { ICommonAttr } from './_common';

export interface IRefreshTokenMainAttr {
  userId: number;
  refreshToken: string;
  expireAt: Date;
}

export interface IRefreshTokenAttr extends IRefreshTokenMainAttr, ICommonAttr {}

export interface IRefreshTokenCreateParams {
  userId: number;
  refreshToken: string;
  expireAt: Date;
}
