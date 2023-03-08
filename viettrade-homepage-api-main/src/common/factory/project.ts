import { ICommonAttr, ICommonSearchOption } from './_common';

export enum Publish {
  PRIVATE = 0,
  PUBLISH = 1,
  DRAFT = 2
}

export interface IProjectMainAttr {
  title_vi: string;
  content_vi: string;
  title_en: string;
  content_en: string;
  feature_image: string;
  feature_document: string;
}

export interface IProjectAttr extends IProjectMainAttr, ICommonAttr {}

export interface IProjectCreateParams {
  title_vi: string;
  content_vi: string;
  description_vi: string;
  title_en: string;
  content_en: string;
  description_en: string;
  feature_image: string;
  feature_document: string;
}
export interface IProjectUpdateParams {
  title_vi: string;
  content_vi: string;
  description_vi: string;
  title_en: string;
  content_en: string;
  description_en: string;
  feature_image: string;
  feature_document: string;
}

export interface IProjectSearchParams extends ICommonSearchOption {
  title_vi?: string;
  content_vi?: string;
  title_en?: string;
  content_en?: string;
  sort?: string;
  sortColumn?: string;
  search?: string;
  role?: string;
}
