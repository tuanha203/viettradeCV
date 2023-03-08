import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.admin.CreateParams>req.body, [
    'role',
    'email',
    'name',
    'password',
    'status'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.admin.UpdateParams>req.body, [
    'role',
    'email',
    'name',
    'password',
    'status'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.admin.SearchParams>req.query, [
    'role',
    'email',
    'name',
    'type',
    'search',
    'status',
    'role',
    'sort',
    'sortColumn'
  ]);
};

export const registerFormData = (req: Request) => {
  return pick(<types.admin.RegisterParams>req.body, [
    'email',
    'name',
    'password'
  ]);
};
