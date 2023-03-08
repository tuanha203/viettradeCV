import { ICommonAttr, ICommonSearchOption } from './_common';

export interface IStructureMainAttr {
  parent_id?: number;
  full_name_vi: string;
  full_name_en?: string;
  position_vi: string;
  position_en: string;
  phone?: string;
  email?: string;
  website: string;
  fax: string;
  level?: number;
  display?: number;
}

export interface IStructureAttr extends IStructureMainAttr, ICommonAttr {}

export interface IStructureCreateParams {
  parent_id?: number;
  full_name_vi: string;
  full_name_en?: string;
  position_vi: string;
  position_en?: string;
  phone?: string;
  email?: string;
  website: string;
  fax: string;
  level?: number;
  display?: number;
  address?: string;
}
export interface IStructureUpdateParams {
  parent_id?: number;
  full_name_vi: string;
  full_name_en?: string;
  position_vi: string;
  position_en?: string;
  phone?: string;
  email?: string;
  website: string;
  fax: string;
  level?: number;
  display?: number;
  address?: string;
}

export interface IStructureSearchParams extends ICommonSearchOption {
  parent_id?: number;
  full_name_vi?: string;
  full_name_en?: string;
  position_vi?: string;
  position_en?: string;
  phone?: string;
  email?: string;
  sort?: string;
  search?: string;
  website?: string;
  fax?: string;
  level?: number;
  address?: string;
}

export interface IStructureUpdateDisplayParams {
  source?: number;
  display_source?: number;
  destination?: number;
  display_destination?: number;
}
