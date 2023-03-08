import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.company.CreateParams>req.body, [
    'name_vi',
    'description_vi',
    'name_en',
    'description_en',
    'link',
    'display',
    'connective',
    'phone',
    'address'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.company.UpdateParams>req.body, [
    'name_vi',
    'description_vi',
    'name_en',
    'description_en',
    'link',
    'display',
    'connective',
    'phone',
    'address'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.company.SearchParams>req.query, [
    'name_vi',
    'description_vi',
    'name_en',
    'description_en',
    'link',
    'connective',
    'search',
    'phone',
    'address',
    'sort',
    'sortColumn'
  ]);
};
