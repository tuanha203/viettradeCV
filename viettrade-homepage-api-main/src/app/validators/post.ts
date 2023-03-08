import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.post.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('category_id', 'category_id', [V.required]),
  b('title_vi', 'title_vi', [V.required]),
  b('content_vi', 'content_vi', [V.required]),
  b('title_en', 'title_en'),
  b('content_en', 'content_en'),
  b('feature_image', 'feature_image'),
  b('publish', 'publish'),
  b('feature_document', 'feature_document')
];
