import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.menu.CreateParams>req.body, [
    'title_vi',
    'title_en',
    'link',
    'display',
    'parent_id'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.menu.UpdateParams>req.body, [
    'title_vi',
    'title_en',
    'link',
    'display',
    'parent_id'
  ]);
};

export const updateDisplayFormData = (req: Request) => {
  return pick(<types.menu.UpdateDisplayParams>req.body, [
    'source',
    'display_source',
    'destination',
    'display_destination'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.menu.SearchParams>req.query, [
    'title_vi',
    'title_en',
    'link',
    'search'
  ]);
};
