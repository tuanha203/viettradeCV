import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IPublicationMainAttr {
  title_vi: string;
  content_vi: string;
  description_vi: string;
  title_en: string;
  content_en: string;
  description_en: string;
  feature_image: string;
  pdf_file: string;
  display: number;
}

export interface IPublicationAttr extends IPublicationMainAttr, ICommonAttr {}

export interface IPublicationCreateParams {
  title_vi: string;
  content_vi: string;
  description_vi: string;
  title_en: string;
  content_en: string;
  description_en: string;
  feature_image: string;
  pdf_file: string;
  display: number;
}
export interface IPublicationUpdateParams {
  title_vi: string;
  content_vi: string;
  description_vi: string;
  title_en: string;
  content_en: string;
  description_en: string;
  feature_image: string;
  pdf_file: string;
  display: number;
}

export interface IPublicationSearchParams extends ICommonSearchOption {
  title_vi?: string;
  content_vi?: string;
  description_vi?: string;
  title_en?: string;
  content_en?: string;
  description_en?: string;
  pdf_file?: string;
  sort?: string;
  sortColumn?: string;
  search?: string;
}
