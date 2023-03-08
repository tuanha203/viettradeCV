import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, query, S, V } from './custom';

const b: GenericCheckFn<types.user.Attr> = body;
const q: GenericCheckFn<types.user.SearchParams> = query;
const BC: GenericCheckFn<types.auth.ContactInfo> = body;

export const search = [q(['role'], [S.multipleValueAsArray]), ...commonSearch];

const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('name', 'name', [V.required, V.maxLength(191), V.isValidNameVN]),
  b('email', 'email', [V.required, V.isValidEmail, V.maxLength(50)]),
  b('password', 'password', [V.required, V.maxLength(20), V.minLength(8)])
];

export const register = [
  ...upsert,
  b('name', 'name', [V.required, V.maxLength(191), V.isValidNameVN]),
  b('email', 'email', [V.required, V.isValidEmail, V.maxLength(50)]),
  b('password', 'password', [V.required, V.maxLength(20), V.minLength(8)])
];

export const contact = [
  ...upsert,
  BC('fullName', 'fullName', [V.required, V.maxLength(50), V.isValidNameVN]),
  BC('email', 'email', [V.required, V.isValidEmail, V.maxLength(50)]),
  BC('phone', 'phone', [V.maxLength(12)]),
  BC('title', 'title', [V.required]),
  BC('content', 'content', [V.required])
];
