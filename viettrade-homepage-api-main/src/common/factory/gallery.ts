import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IGalleryMainAttr {
  title_vi: string;
  content_vi: string;
  title_en: string;
  content_en: string;
  feature_video: string;
}

export interface IGalleryAttr extends IGalleryMainAttr, ICommonAttr {}

export interface IGalleryCreateParams {
  title_vi: string;
  content_vi: string;
  title_en: string;
  content_en: string;
  feature_video: string;
}
export interface IGalleryUpdateParams {
  title_vi: string;
  content_vi: string;
  title_en: string;
  content_en: string;
  feature_video: string;
}

export interface IGallerySearchParams extends ICommonSearchOption {
  title_vi?: string;
  content_vi?: string;
  title_en?: string;
  content_en?: string;
  sort?: string;
  search?: string;
}
