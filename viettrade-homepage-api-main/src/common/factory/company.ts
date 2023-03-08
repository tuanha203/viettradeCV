import { ICommonAttr, ICommonSearchOption } from './_common';

export enum Connective {
  UNCONNECTIVE = 0,
  CONNECTIVE = 1
}

export enum Status {
  INACTIVE = 0,
  ACTIVE = 1
}

export interface ICompanyMainAttr {
  name_vi: string;
  description_vi: string;
  name_en: string;
  description_en: string;
  feature_image: string;
  link: string;
  display: number;
  phone: string;
  address: string;
  connective: Connective;
}

export interface ICompanyAttr extends ICompanyMainAttr, ICommonAttr {}

export interface ICompanyCreateParams {
  name_vi: string;
  description_vi: string;
  name_en: string;
  description_en: string;
  link: string;
  display: number;
  connective: Connective;
  phone: string;
  address: string;
}

export interface ICompanyUpdateParams {
  name_vi: string;
  description_vi: string;
  name_en: string;
  description_en: string;
  link: string;
  display: number;
  connective: Connective;
  status: Status;
  phone: string;
  address: string;
}

export interface ICompanySearchParams extends ICommonSearchOption {
  name_vi?: string;
  description_vi?: string;
  name_en?: string;
  description_en?: string;
  link?: string;
  connective?: Connective;
  phone?: string;
  address?: string;
  status?: Status;
  sort?: string;
  sortColumn?: string;
  search?: string;
}
