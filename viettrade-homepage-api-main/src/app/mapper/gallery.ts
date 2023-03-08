import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.gallery.CreateParams>req.body, [
    'title_vi',
    'content_vi',
    'title_en',
    'content_en',
    'feature_video'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.gallery.UpdateParams>req.body, [
    'title_vi',
    'content_vi',
    'title_en',
    'content_en',
    'feature_video'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.gallery.SearchParams>req.query, [
    'title_vi',
    'content_vi',
    'title_en',
    'content_en',
    'sort',
    'search'
  ]);
};
