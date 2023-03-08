import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.document.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('category_id', 'category_id', [V.required]),
  b('title_vi', 'title_vi', [V.required]),
  b('description_vi', 'description_vi', [V.required]),
  b('title_en', 'title_en'),
  b('description_en', 'description_en')
];
