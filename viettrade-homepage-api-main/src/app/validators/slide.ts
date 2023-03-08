import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.slide.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [...upsert, b('title', 'title', [V.required])];

export const updateDisplay = [b('display', 'display', [V.required])];
