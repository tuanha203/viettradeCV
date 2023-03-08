import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/question';
import BaseController from './_base';

class QuestionController extends BaseController {
  private readonly questionRepo: repository.Question;

  constructor(db: SQLize) {
    super(db);
    this.questionRepo = new repository.Question(this.db);

    this.create = this.nextWrapper(this.create);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.questionRepo.create(mapper.createFormData(req));
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.questionRepo.update(
      req.params.id,
      mapper.updateFormData(req)
    );
    this.created(res, result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.questionRepo.delete(req.params.id);
    res.json({ success: true });
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.questionRepo.searchId(req.params.id);
    res.json(result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.questionRepo.search(<types.question.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };
}

export default QuestionController;
