import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/categoryDocument';
import BaseController from './_base';

class CategoryController extends BaseController {
  private readonly categoryDocumentRepo: repository.CategoryDocument;

  constructor(db: SQLize) {
    super(db);
    this.categoryDocumentRepo = new repository.CategoryDocument(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.delete = this.nextWrapper(this.delete);
    this.searchId = this.nextWrapper(this.searchId);
    this.search = this.nextWrapper(this.search);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.categoryDocumentRepo.create(
      mapper.createFormData(req)
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.categoryDocumentRepo.update(
      req.params.id,
      mapper.updateFormData(req)
    );
    this.created(res, result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.categoryDocumentRepo.delete(req.params.id);
    res.json({ success: true });
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.categoryDocumentRepo.searchId(req.params.id);
    res.json(result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.categoryDocumentRepo.search(<
      types.categoryDocument.SearchParams
    >{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };
}

export default CategoryController;
