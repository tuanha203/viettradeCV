import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.categoryDocument.CreateParams>req.body, [
    'category_id',
    'title_vi',
    'title_en'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.categoryDocument.UpdateParams>req.body, [
    'category_id',
    'title_vi',
    'title_en'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.categoryDocument.SearchParams>req.query, [
    'category_id',
    'title_vi',
    'title_en',
    'search',
    'sort',
    'sortColumn',
    'all_levels'
  ]);
};
