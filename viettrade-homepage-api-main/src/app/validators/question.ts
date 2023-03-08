import { types } from '../../common';
import { commonSearch } from './_common';
import { body, GenericCheckFn, S, V } from './custom';

const b: GenericCheckFn<types.question.Attr> = body;

export const search = [...commonSearch];
const upsert = [body('*', [S.emptyStringAsNull])];

export const create = [
  ...upsert,
  b('question_vi', 'question_vi', [V.required]),
  b('answer_vi', 'answer_vi', [V.required]),
  b('question_en', 'question_en'),
  b('answern_en', 'answern_en'),
  b('display', 'display')
];

export const update = [
  ...upsert,
  b('question_vi', 'question_vi'),
  b('answer_vi', 'answer_vi'),
  b('question_en', 'question_en'),
  b('answern_en', 'answern_en'),
  b('display', 'display')
];
