import { ICommonAttr, ICommonSearchOption } from './_common';

export enum Publish {
  PRIVATE = 0,
  PUBLISH = 1,
  DRAFT = 2
}

export interface IPostMainAttr {
  category_id: number;
  title_vi: string;
  content_vi: string;
  title_en: string;
  content_en: string;
  feature_image: string;
  view_count: number;
  publish?: Publish;
  feature_document: string;
}

export interface IPostAttr extends IPostMainAttr, ICommonAttr {}

export interface IPostCreateParams {
  category_id: number;
  title_vi: string;
  content_vi: string;
  description_vi: string;
  title_en: string;
  content_en: string;
  description_en: string;
  feature_image: string;
  publish: Publish;
  status: number;
  feature_document: string;
}
export interface IPostUpdateParams {
  category_id: number;
  title_vi: string;
  content_vi: string;
  description_vi: string;
  title_en: string;
  content_en: string;
  description_en: string;
  feature_image: string;
  publish: Publish;
  status: number;
  feature_document: string;
}

export interface IPostSearchParams extends ICommonSearchOption {
  category_id?: number;
  title_vi?: string;
  content_vi?: string;
  title_en?: string;
  content_en?: string;
  sort?: string;
  sortColumn?: string;
  search?: string;
  publish?: string;
  status?: number;
  role?: string;
}
