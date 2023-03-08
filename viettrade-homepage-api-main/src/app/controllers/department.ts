import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/department';
import BaseController from './_base';

class DepartmentController extends BaseController {
  private readonly departmentRepo: repository.Department;

  constructor(db: SQLize) {
    super(db);
    this.departmentRepo = new repository.Department(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.searchId = this.nextWrapper(this.searchId);
    this.search = this.nextWrapper(this.search);
    this.delete = this.nextWrapper(this.delete);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.departmentRepo.create(
      mapper.createFormData(req),
      req.file ? '/' + req.file.path : undefined
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.departmentRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      req.file ? '/' + req.file.path : undefined
    );
    this.created(res, result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.departmentRepo.search(<
      types.department.SearchParams
    >{
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
    const result = await this.departmentRepo.searchAll(<
      types.department.SearchParams
    >{
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
    const post = await this.departmentRepo.searchId(req.params.id);
    res.json(post);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.departmentRepo.delete(req.params.id);
    res.json({ success: true });
  };
}

export default DepartmentController;
