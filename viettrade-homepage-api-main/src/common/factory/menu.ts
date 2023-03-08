import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IMenuMainAttr {
  title_vi: string;
  title_en: string;
  link: string;
  display: number;
  parent_id: number;
}

export interface IMenuAttr extends IMenuMainAttr, ICommonAttr {}

export interface IMenuCreateParams {
  title_vi: string;
  title_en: string;
  link: string;
  display: number;
  parent_id: number;
}
export interface IMenuUpdateParams {
  title_vi: string;
  title_en: string;
  link: string;
  display: number;
  parent_id: number;
}
export interface IMenuUpdateDisplayParams {
  source: number;
  display_source: number;
  destination: number;
  display_destination: number;
}

export interface IMenuSearchParams extends ICommonSearchOption {
  title_vi?: string;
  title_en?: string;
  link?: string;
  sort?: string;
  search?: string;
}
