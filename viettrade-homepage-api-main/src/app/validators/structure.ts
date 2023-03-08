import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.structure.Attr> = body;

const upsert = [body('*', [S.emptyStringAsNull])];
export const search = [...commonSearch];

export const create = [
  ...upsert,
  b('full_name_vi', 'full_name_vi', [V.required])
];
