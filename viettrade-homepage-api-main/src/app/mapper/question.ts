import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.question.CreateParams>req.body, [
    'question_vi',
    'answer_vi',
    'question_en',
    'answern_en',
    'display'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.question.UpdateParams>req.body, [
    'question_vi',
    'answer_vi',
    'question_en',
    'answern_en',
    'display'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.question.SearchParams>req.query, [
    'question_vi',
    'answer_vi',
    'question_en',
    'answern_en',
    'display',
    'sort',
    'search'
  ]);
};
