import * as createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { CREATED, NO_CONTENT } from 'http-status';
import * as requestIp from 'request-ip';

const debug = createDebug('api:controllers');

/**
 * base controller class for all other controller
 * contain common method and property
 */
export default abstract class BaseController {
  protected readonly db: SQLize;

  constructor(db: SQLize) {
    this.db = db;
  }

  /**
   * write access log
   *
   * @param req
   * @param extend
   */
  protected logClientInfo(req: Request, param?: any) {
    let info = {
      'user-ip': requestIp.getClientIp(req),
      'user-agent': req.headers['user-agent'],
      'user-id': req.user?.id
    };
    info = {
      ...info,
      ...param
    };

    debug('-----ACCESS LOG-----:', JSON.stringify(info));
  }

  protected ok(res: Response, data: { rows: any; count?: number }) {
    if (data.count !== undefined) {
      res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
      res.setHeader('X-Total-Count', data.count);
    }

    res.json(data.rows);
  }

  protected created(res: Response, result?: any) {
    if (result === undefined) {
      res.status(CREATED).send();
    } else {
      res.status(CREATED).json(result);
    }
  }

  protected noContent(res: Response) {
    res.status(NO_CONTENT).send();
  }

  protected nextWrapper(
    mainFunction: (
      req: Request,
      res: Response,
      next?: NextFunction
    ) => Promise<void>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await mainFunction(req, res, next);
      } catch (err) {
        next(err);
      }
    };
  }

  protected getOffsetLimit(req: Request) {
    const page = Number(req.query.offset);
    const limit = Number(req.query.limit);
    if (
      !isNaN(limit) &&
      req.query.limit !== undefined &&
      req.query.limit !== null &&
      req.query.limit !== ''
    ) {
      if (!isNaN(page) && page > 0) {
        const offset = page * limit - limit;
        return { offset, limit };
      } else {
        return { offset: 0, limit };
      }
    } else {
      return { offset: 0, limit: '' };
    }
  }
}
