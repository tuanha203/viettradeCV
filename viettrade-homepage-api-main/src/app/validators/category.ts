import { types } from '../../common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.category.Attr> = body;

const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('title_vi', 'title_vi', [V.required]),
  b('title_en', 'title_en', [V.required])
];
