import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.document.CreateParams>req.body, [
    'category_id',
    'title_vi',
    'description_vi',
    'title_en',
    'description_en'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.document.UpdateParams>req.body, [
    'category_id',
    'title_vi',
    'description_vi',
    'description_en',
    'title_en'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.document.SearchParams>req.query, [
    'category_id',
    'title_vi',
    'description_vi',
    'title_en',
    'description_en',
    'search',
    'sortColumn',
    'sort'
  ]);
};
