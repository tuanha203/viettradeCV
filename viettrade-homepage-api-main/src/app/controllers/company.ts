import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/company';
import BaseController from './_base';

class CompanyController extends BaseController {
  private readonly companyRepo: repository.Company;

  constructor(db: SQLize) {
    super(db);
    this.companyRepo = new repository.Company(this.db);

    this.create = this.nextWrapper(this.create);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.companyRepo.create(
      mapper.createFormData(req),
      req.file ? '/public/files/' + req.file.filename : undefined
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.companyRepo.update(
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
    const result = await this.companyRepo.updateDisplay(
      req.params.id,
      mapper.updateFormData(req)
    );
    this.created(res, result);
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const post = await this.companyRepo.searchId(req.params.id);
    res.json(post);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.companyRepo.search(<types.company.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };

  public searchAll = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.companyRepo.searchAll(<
      types.company.SearchParams
    >{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.companyRepo.delete(req.params.id);
    res.json({ success: true });
  };

  public approve = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.companyRepo.approve(
      req.params.id,
      req.body.status
    );
    this.created(res, result);
  };
}

export default CompanyController;
