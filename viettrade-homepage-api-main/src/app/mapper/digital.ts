import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.digital.CreateParams>req.body, [
    'title_vi',
    'title_en',
    'link',
    'display'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.digital.UpdateParams>req.body, [
    'title_vi',
    'title_en',
    'link',
    'display'
  ]);
};

export const updateDisplayFormData = (req: Request) => {
  return pick(<types.digital.UpdateDisplayParams>req.body, [
    'source',
    'display_source',
    'destination',
    'display_destination'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.digital.SearchParams>req.query, [
    'title_vi',
    'title_en',
    'display',
    'sort',
    'search'
  ]);
};
