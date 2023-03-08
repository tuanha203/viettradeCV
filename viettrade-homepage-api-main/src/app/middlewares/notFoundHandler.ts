/**
 * 404ハンドラーミドルウェア
 */
import { NextFunction, Request, Response } from 'express';

import { errors } from '../../common';

export default (req: Request, __: Response, next: NextFunction) => {
  next(new errors.NotFound(`router for [${req.path}]`));
};
