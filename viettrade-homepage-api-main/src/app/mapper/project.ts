import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.project.CreateParams>req.body, [
    'title_vi',
    'content_vi',
    'description_vi',
    'title_en',
    'content_en',
    'description_en'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.project.UpdateParams>req.body, [
    'title_vi',
    'content_vi',
    'description_vi',
    'title_en',
    'content_en',
    'description_en'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.project.SearchParams>req.query, [
    'title_vi',
    'content_vi',
    'title_en',
    'content_en',
    'search',
    'sortColumn',
    'sort',
    'role'
  ]);
};
