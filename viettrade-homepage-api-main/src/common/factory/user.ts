import { ICommonAttr, ICommonSearchOption } from './_common';

export enum Role {
  ADMIN = 0,
  CONTENT = 1,
  USER = 2
}

export enum Status {
  ACTIVE = 1,
  INACTIVE = 2
}

export interface IUserMainAttr {
  role: Role;
  name: string;
  email: string;
  password: string;
  status: Status;
  phone: string;
}

export interface IUserAttr extends IUserMainAttr, ICommonAttr {}

export interface IUserSearchParams extends ICommonSearchOption {
  type?: string;
  role?: string;
  name?: string;
  email?: string;
  sort?: string;
  sortColumn?: string;
  search?: string;
  status?: Status;
  phone?: string;
}

export interface IUserCreateParams {
  role?: Role;
  name: string;
  email: string;
  password: string;
  status: Status;
  phone?: string;
  resetExpiration?: number;
  resetToken?: string;
}

export interface IUserRegisterParams {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface IUserUpdateParams {
  role?: Role;
  name: string;
  email: string;
  password?: string;
  status?: Status;
  phone?: string;
  resetExpiration?: number;
  resetToken?: string;
}
