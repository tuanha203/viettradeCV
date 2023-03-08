import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.post.CreateParams>req.body, [
    'category_id',
    'title_vi',
    'content_vi',
    'description_vi',
    'title_en',
    'content_en',
    'description_en',
    'publish'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.post.UpdateParams>req.body, [
    'category_id',
    'title_vi',
    'content_vi',
    'description_vi',
    'title_en',
    'content_en',
    'description_en',
    'publish',
    'status'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.post.SearchParams>req.query, [
    'category_id',
    'title_vi',
    'content_vi',
    'title_en',
    'content_en',
    'search',
    'sortColumn',
    'sort',
    'publish',
    'role'
  ]);
};
