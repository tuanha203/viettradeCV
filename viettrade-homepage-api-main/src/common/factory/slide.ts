import { ICommonAttr, ICommonSearchOption } from './_common';

export interface ISlideMainAttr {
  title: string;
  feature_image: string;
  link: string;
  display: number;
}

export interface ISlideAttr extends ISlideMainAttr, ICommonAttr {}

export interface ISlideCreateParams {
  title: string;
  feature_image: string;
  link: string;
  display: number;
}
export interface ISlideUpdateParams {
  title: string;
  feature_image: string;
  link: string;
  display: number;
}
export interface ISlideUpdateDisplayParams {
  source: number;
  display_source: number;
  destination: number;
  display_destination: number;
}

export interface ISlideSearchParams extends ICommonSearchOption {
  title?: string;
  link?: string;
  sort?: string;
  search?: string;
}
