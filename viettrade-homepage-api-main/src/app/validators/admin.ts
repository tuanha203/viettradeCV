import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, query, S, V } from './custom';

const b: GenericCheckFn<types.admin.Attr> = body;
const q: GenericCheckFn<types.admin.SearchParams> = query;

export const search = [q(['role'], [S.multipleValueAsArray]), ...commonSearch];

const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('name', 'name', [V.required, V.maxLength(20), V.isValidNameVN]),
  b('email', 'email', [V.required, V.isValidEmail, V.maxLength(50)]),
  b('password', 'password', [V.required, V.maxLength(20), V.minLength(8)])
];

export const register = [
  ...upsert,
  b('name', 'name', [V.required, V.maxLength(20), V.isValidNameVN]),
  b('email', 'email', [V.required, V.isValidEmail, V.maxLength(50)]),
  b('password', 'password', [V.required, V.maxLength(20), V.minLength(8)])
];
