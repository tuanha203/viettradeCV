import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/user';
import BaseController from './_base';

class UserController extends BaseController {
  private readonly userRepo: repository.User;

  constructor(db: SQLize) {
    super(db);
    this.userRepo = new repository.User(this.db);

    this.create = this.nextWrapper(this.create);
    this.search = this.nextWrapper(this.search);
    this.searchId = this.nextWrapper(this.searchId);
    this.delete = this.nextWrapper(this.delete);
    this.update = this.nextWrapper(this.update);
    this.register = this.nextWrapper(this.register);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.userRepo.create({
      ...mapper.createFormData(req)
    });
    this.created(res, result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.userRepo.search(<types.user.SearchParams>{
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
    const user = await this.userRepo.searchId(req.params.id);
    res.json(user);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.userRepo.delete(req.params.id);
    res.json({ success: true });
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.userRepo.update(
      mapper.updateFormData(req),
      req.params.id
    );
    this.created(res, result);
  };

  public createAdmin = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.userRepo.createAdmin(mapper.createFormData(req));
    this.created(res, result);
  };

  public register = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.userRepo.register({
      ...mapper.registerFormData(req)
    });
    this.created(res, result);
  };

  public updateUser = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.userRepo.updateUser(
      mapper.updateFormData(req),
      req.user?.id
    );
    this.created(res, result);
  };
}

export default UserController;
