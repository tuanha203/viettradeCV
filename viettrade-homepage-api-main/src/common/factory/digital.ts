import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IDigitalMainAttr {
  title_vi: string;
  title_en: string;
  feature_image: string;
  feature_icon: string;
  link: string;
  display: number;
}

export interface IDigitalAttr extends IDigitalMainAttr, ICommonAttr {}

export interface IDigitalCreateParams {
  title_vi: string;
  title_en: string;
  feature_image: string;
  feature_icon: string;
  link: string;
  display: number;
}
export interface IDigitalUpdateParams {
  title_vi: string;
  title_en: string;
  feature_image: string;
  feature_icon: string;
  link: string;
  display: number;
}

export interface IDigitalSearchParams extends ICommonSearchOption {
  title_vi?: string;
  title_en?: string;
  display?: number;
  sort?: string;
  search?: string;
}

export interface IDigitalUpdateDisplayParams {
  source: number;
  display_source: number;
  destination: number;
  display_destination: number;
}
