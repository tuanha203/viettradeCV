import { ICommonAttr, ICommonSearchOption } from './_common';

export enum Role {
  ADMIN = 0,
  CONTENT = 1,
  MANAGER = 2
}

export enum Status {
  ACTIVE = 1,
  INACTIVE = 2
}

export interface IAdminMainAttr {
  role: Role;
  name: string;
  email: string;
  password: string;
  status: Status;
  feature_image?: string;
}

export interface IAdminAttr extends IAdminMainAttr, ICommonAttr {}

export interface IAdminSearchParams extends ICommonSearchOption {
  type?: string;
  role?: Role;
  name?: string;
  email?: string;
  sort?: string;
  sortColumn?: string;
  status?: Status;
  search?: string;
}

export interface IAdminCreateParams {
  role?: Role;
  name: string;
  email: string;
  password: string;
  status: Status;
  feature_image?: string;
}

export interface IAdminRegisterParams {
  name: string;
  email: string;
  password: string;
  feature_image?: string;
}

export interface IAdminUpdateParams {
  role?: Role;
  name: string;
  email: string;
  password?: string;
  status?: Status;
  feature_image?: string;
}
