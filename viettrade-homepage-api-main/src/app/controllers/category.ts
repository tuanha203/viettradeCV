import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/category';
import BaseController from './_base';

class CategoryController extends BaseController {
  private readonly categoryRepo: repository.Category;

  constructor(db: SQLize) {
    super(db);
    this.categoryRepo = new repository.Category(this.db);

    this.create = this.nextWrapper(this.create);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.categoryRepo.create(
      mapper.createFormData(req),
      req.file ? '/public/files/' + req.file.filename : ''
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.categoryRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      req.file ? '/public/files/' + req.file.filename : ''
    );
    this.created(res, result);
  };

  public updateDisplay = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const category = await this.categoryRepo.updateDisplay(
      req.params.id,
      mapper.updateDisplayFormData(req)
    );
    res.json(category);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.categoryRepo.delete(req.params.id);
    res.json({ success: true });
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.categoryRepo.searchId(req.params.id);
    res.json(result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.categoryRepo.search(<types.category.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };
}

export default CategoryController;
