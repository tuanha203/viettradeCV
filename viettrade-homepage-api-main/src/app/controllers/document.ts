import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/document';
import BaseController from './_base';

class DocumentController extends BaseController {
  private readonly documentRepo: repository.Document;

  constructor(db: SQLize) {
    super(db);
    this.documentRepo = new repository.Document(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.searchId = this.nextWrapper(this.searchId);
    this.search = this.nextWrapper(this.search);
    this.delete = this.nextWrapper(this.delete);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.documentRepo.create(
      mapper.createFormData(req),
      req.file ? '/' + req.file.path : undefined
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.documentRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      req.file ? '/' + req.file.path : undefined
    );
    this.created(res, result);
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const document = await this.documentRepo.searchId(req.params.id);
    res.json(document);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.documentRepo.search(<types.document.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.documentRepo.delete(req.params.id);
    res.json({ success: true });
  };
}

export default DocumentController;
