import { ValidationChain } from 'express-validator';

import { query, V } from './custom';

const optional = (check: ValidationChain, _: string) =>
  check.optional({ checkFalsy: true });

export const commonSearch = [
  query('limit', 'Limit', [optional, V.isDigits, V.isUnsigned]),
  query('offset', 'Page', [optional, V.isDigits, V.isUnsigned])
];
