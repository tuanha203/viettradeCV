import { ICommonAttr, ICommonSearchOption } from './_common';

export interface ICategoryMainAttr {
  title_vi: string;
  title_en: string;
  display: number;
  feature_image: string;
}

export interface ICategoryAttr extends ICategoryMainAttr, ICommonAttr {}

export interface ICategoryCreateParams {
  title_vi: string;
  title_en: string;
  feature_image: string;
  display: number;
}
export interface ICategoryUpdateParams {
  title_vi: string;
  title_en: string;
  feature_image: string;
}

export interface ICategoryUpdateDisplayParams {
  display: number;
}
export interface ICategorySearchParams extends ICommonSearchOption {
  title_vi?: string;
  title_en?: string;
  sort?: string;
  sortColumn?: string;
  search?: string;
}
