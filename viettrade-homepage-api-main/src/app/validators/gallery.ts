import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.gallery.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('title_vi', 'title_vi', [V.required]),
  b('content_vi', 'content_vi', [V.required])
];

export const update = [
  ...upsert,
  b('title_vi', 'title_vi', [V.required]),
  b('content_vi', 'content_vi', [V.required])
];
