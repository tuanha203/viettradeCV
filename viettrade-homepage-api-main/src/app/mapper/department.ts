import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.department.CreateParams>req.body, [
    'parent_id',
    'full_name',
    'position_vi',
    'phone',
    'email',
    'position_en',
    'feature_image'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.department.UpdateParams>req.body, [
    'parent_id',
    'full_name',
    'position_vi',
    'position_en',
    'phone',
    'email',
    'feature_image'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.department.SearchParams>req.query, [
    'parent_id',
    'full_name',
    'position_vi',
    'position_en',
    'phone',
    'email',
    'sort',
    'search'
  ]);
};
