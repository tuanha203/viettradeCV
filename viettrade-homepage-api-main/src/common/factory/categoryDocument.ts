import { ICommonAttr, ICommonSearchOption } from './_common';

export interface ICategoryDocumentMainAttr {
  category_id: number;
  title_vi: string;
  title_en: string;
}

export interface ICategoryDocumentAttr
  extends ICategoryDocumentMainAttr,
    ICommonAttr {}

export interface ICategoryDocumentCreateParams {
  category_id: number;
  title_vi: string;
  title_en: string;
}
export interface ICategoryDocumentUpdateParams {
  category_id: number;
  title_vi: string;
  title_en: string;
}

export interface ICategoryDocumentSearchParams extends ICommonSearchOption {
  category_id?: number;
  title_vi?: string;
  title_en?: string;
  all_levels?: number;
  search?: string;
  sort?: string;
  sortColumn?: string;
}
