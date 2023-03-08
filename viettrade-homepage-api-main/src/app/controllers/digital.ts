import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/digital';
import BaseController from './_base';

class DigitalController extends BaseController {
  private readonly digitalRepo: repository.Digital;

  constructor(db: SQLize) {
    super(db);
    this.digitalRepo = new repository.Digital(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.searchId = this.nextWrapper(this.searchId);
    this.search = this.nextWrapper(this.search);
    this.delete = this.nextWrapper(this.delete);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result = await this.digitalRepo.create(
      mapper.createFormData(req),
      files.feature_image ? files.feature_image[0].path : undefined,
      files.feature_icon ? files.feature_icon[0].path : undefined
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result = await this.digitalRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      files.feature_image ? files.feature_image[0].path : undefined,
      files.feature_icon ? files.feature_icon[0].path : undefined
    );
    this.created(res, result);
  };

  public updateDisplay = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const slide = await this.digitalRepo.updateDisplay(
      mapper.updateDisplayFormData(req)
    );
    res.json(slide);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.digitalRepo.delete(req.params.id);
    res.json({ success: true });
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.digitalRepo.searchId(req.params.id);
    res.json(result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.digitalRepo.search(<types.question.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };
}

export default DigitalController;
