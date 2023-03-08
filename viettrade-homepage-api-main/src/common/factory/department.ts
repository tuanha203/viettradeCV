import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IDepartmentMainAttr {
  parent_id: number;
  full_name: string;
  position_vi: string;
  position_en: string;
  phone?: string;
  email?: string;
  feature_image: string;
}

export interface IDepartmentAttr extends IDepartmentMainAttr, ICommonAttr {}

export interface IDepartmentCreateParams {
  parent_id: number;
  full_name: string;
  position_vi: string;
  position_en?: string;
  phone?: string;
  email?: string;
  feature_image: string;
}
export interface IDepartmentUpdateParams {
  parent_id: number;
  full_name: string;
  position_vi: string;
  position_en?: string;
  phone?: string;
  email?: string;
  feature_image: string;
}

export interface IDepartmentSearchParams extends ICommonSearchOption {
  parent_id?: number;
  full_name?: string;
  position_vi?: string;
  position_en?: string;
  phone?: string;
  email?: string;
  sort?: string;
  search?: string;
}
