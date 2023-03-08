import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.digital.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('title_vi', 'title_vi', [V.required]),
  b('title_en', 'title_en', [V.required]),
  b('feature_image', 'feature_image'),
  b('feature_icon', 'feature_icon'),
  b('link', 'link'),
  b('display', 'display')
];

export const update = [
  ...upsert,
  b('title_vi', 'title_vi'),
  b('title_en', 'title_en'),
  b('feature_image', 'feature_image'),
  b('feature_icon', 'feature_icon'),
  b('link', 'link'),
  b('display', 'display')
];
