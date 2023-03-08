import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.slide.CreateParams>req.body, [
    'title',
    'link',
    'display',
    'feature_image'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.slide.UpdateParams>req.body, [
    'title',
    'link',
    'display',
    'feature_image'
  ]);
};

export const updateDisplayFormData = (req: Request) => {
  return pick(<types.slide.UpdateDisplayParams>req.body, [
    'source',
    'display_source',
    'destination',
    'display_destination'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.slide.SearchParams>req.query, [
    'title',
    'link',
    'search'
  ]);
};
