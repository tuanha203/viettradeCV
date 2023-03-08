import { Request } from 'express';

import { types } from '../../common';
import { pick, pickForSearch } from '../utils';

export const createFormData = (req: Request) => {
  return pick(<types.user.CreateParams>req.body, [
    'role',
    'email',
    'name',
    'password',
    'status',
    'phone'
  ]);
};

export const updateFormData = (req: Request) => {
  return pick(<types.user.UpdateParams>req.body, [
    'role',
    'email',
    'name',
    'password',
    'status',
    'phone'
  ]);
};

export const searchData = (req: Request) => {
  return pickForSearch(<types.user.SearchParams>req.query, [
    'role',
    'email',
    'name',
    'type',
    'sort',
    'sortColumn',
    'search',
    'status',
    'phone'
  ]);
};

export const registerFormData = (req: Request) => {
  return pick(<types.user.RegisterParams>req.body, [
    'email',
    'name',
    'password',
    'phone'
  ]);
};
