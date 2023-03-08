import { types } from '../../common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.department.Attr> = body;

const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('full_name', 'full_name', [V.required]),
  b('position_vi', 'position_vi', [V.required])
];
