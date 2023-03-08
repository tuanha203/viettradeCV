import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.publication.CreateParams>req.body, [
    'title_vi',
    'content_vi',
    'description_vi',
    'title_en',
    'content_en',
    'description_en',
    'feature_image',
    'pdf_file',
    'display'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.publication.UpdateParams>req.body, [
    'title_vi',
    'content_vi',
    'description_vi',
    'title_en',
    'content_en',
    'description_en',
    'feature_image',
    'pdf_file',
    'display'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.publication.SearchParams>req.query, [
    'title_vi',
    'content_vi',
    'description_vi',
    'title_en',
    'content_en',
    'description_en',
    'pdf_file',
    'sort',
    'sortColumn',
    'search'
  ]);
};
