import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.category.CreateParams>req.body, ['title_vi', 'title_en']);
};

export const updateFormData = (req: Request) => {
  return pick(<types.category.UpdateParams>req.body, ['title_vi', 'title_en']);
};

export const updateDisplayFormData = (req: Request) => {
  return pick(<types.category.UpdateDisplayParams>req.body, ['display']);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.category.SearchParams>req.query, [
    'title_vi',
    'title_en',
    'search'
  ]);
};
