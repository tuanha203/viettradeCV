import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.menu.Attr> = body;

const upsert = [body('*', [S.emptyStringAsNull])];
export const search = [...commonSearch];
export const create = [
  ...upsert,
  b('title_vi', 'title_vi', [V.required]),
  b('display', 'display', [V.required])
];
