import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.publication.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('title_vi', 'title_vi', [V.required]),
  b('content_vi', 'content_vi', [V.required]),
  b('description_vi', 'description_vi', [V.required]),
  b('title_en', 'title_en'),
  b('content_en', 'content_en'),
  b('description_en', 'description_en', [V.required]),
  b('feature_image', 'feature_image'),
  b('pdf_file', 'pdf_file'),
  b('display', 'display')
];

export const update = [
  ...upsert,
  b('title_vi', 'title_vi'),
  b('content_vi', 'content_vi'),
  b('description_vi', 'description_vi'),
  b('title_en', 'title_en'),
  b('content_en', 'content_en'),
  b('description_en', 'description_en'),
  b('feature_image', 'feature_image'),
  b('pdf_file', 'pdf_file'),
  b('display', 'display')
];
