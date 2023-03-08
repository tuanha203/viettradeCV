import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.company.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('name_vi', 'name_vi', [V.required]),
  b('description_vi', 'description_vi', [V.required]),
  b('name_en', 'name_en'),
  b('description_en', 'description_en'),
  b('link', 'link')
];
