import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IDocumentMainAttr {
  category_id: number;
  title_vi: string;
  description_vi: string;
  title_en: string;
  description_en: string;
  feature_document: string;
}

export interface IDocumentAttr extends IDocumentMainAttr, ICommonAttr {}

export interface IDocumentCreateParams {
  category_id: number;
  title_vi: string;
  description_vi: string;
  title_en: string;
  description_en: string;
  feature_document: string;
}
export interface IDocumentUpdateParams {
  category_id: number;
  title_vi: string;
  description_vi: string;
  title_en: string;
  description_en: string;
  feature_document: string;
}

export interface IDocumentSearchParams extends ICommonSearchOption {
  category_id?: number;
  title_vi?: string;
  description_vi?: string;
  title_en?: string;
  description_en?: string;
  sort?: string;
  sortColumn?: string;
  search?: string;
}
