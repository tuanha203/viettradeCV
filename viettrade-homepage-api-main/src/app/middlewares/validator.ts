/**
 * バリデーターミドルウェア
 * リクエストのパラメータ(query strings or body parameters)に対するバリデーション
 */
import * as createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { BAD_REQUEST } from 'http-status';
import { map } from 'lodash';

import LocaleService from '../locale';
import i18n from '../utils/i18n';

const debug = createDebug('api');

export default async (req: Request, res: Response, next: NextFunction) => {
  const localeService = new LocaleService(i18n);
  const validatorResult = validationResult(req);
  if (!validatorResult.isEmpty()) {
    const errors = map(
      validatorResult.array({ onlyFirstError: true }),
      (mappedError) => {
        if (typeof mappedError.msg === 'object') {
          return localeService.translateArrgs(mappedError.msg);
        }
        return mappedError.msg;
      }
    );
    debug('validation result not empty...', errors);

    res.status(BAD_REQUEST).json({
      errors
    });
  } else {
    next();
  }
};
