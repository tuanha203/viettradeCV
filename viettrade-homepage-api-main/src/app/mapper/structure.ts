import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.structure.CreateParams>req.body, [
    'parent_id',
    'full_name_vi',
    'full_name_en',
    'position_vi',
    'position_en',
    'phone',
    'email',
    'fax',
    'website',
    'level',
    'address'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.structure.UpdateParams>req.body, [
    'parent_id',
    'full_name_vi',
    'full_name_en',
    'position_vi',
    'position_en',
    'phone',
    'email',
    'fax',
    'website',
    'level',
    'address'
  ]);
};

export const updateDisplayFormData = (req: Request) => {
  return pick(<types.structure.UpdateDisplayParams>req.body, [
    'source',
    'display_source',
    'destination',
    'display_destination'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.structure.SearchParams>req.query, [
    'parent_id',
    'full_name_vi',
    'full_name_en',
    'position_vi',
    'position_en',
    'phone',
    'email',
    'sort',
    'fax',
    'website',
    'search',
    'address'
  ]);
};
