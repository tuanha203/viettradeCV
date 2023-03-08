import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/slide';
import BaseController from './_base';

class SlideController extends BaseController {
  private readonly slideRepo: repository.Slide;

  constructor(db: SQLize) {
    super(db);
    this.slideRepo = new repository.Slide(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.updateDisplay = this.nextWrapper(this.updateDisplay);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.slideRepo.create(
      mapper.createFormData(req),
      req.file ? '/public/files/' + req.file.filename : undefined
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.slideRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      req.file ? '/public/files/' + req.file.filename : undefined
    );
    this.created(res, result);
  };

  public updateDisplay = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const slide = await this.slideRepo.updateDisplay(
      mapper.updateDisplayFormData(req)
    );
    res.json(slide);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.slideRepo.search(<types.post.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.slideRepo.searchId(req.params.id);
    res.json(result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.slideRepo.delete(req.params.id);
    res.json({ success: true });
  };
}

export default SlideController;
