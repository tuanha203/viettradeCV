import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/menu';
import BaseController from './_base';

class MenuController extends BaseController {
  private readonly menuRepo: repository.Menu;

  constructor(db: SQLize) {
    super(db);
    this.menuRepo = new repository.Menu(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.updateDisplay = this.nextWrapper(this.updateDisplay);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.menuRepo.create(mapper.createFormData(req));
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.menuRepo.update(
      req.params.id,
      mapper.updateFormData(req)
    );
    this.created(res, result);
  };

  public updateDisplay = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const menu = await this.menuRepo.updateDisplay(
      mapper.updateDisplayFormData(req)
    );
    res.json(menu);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.menuRepo.search(<types.post.SearchParams>{
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
    const result = await this.menuRepo.searchId(req.params.id);
    res.json(result);
  };

  public searchSubMenu = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.menuRepo.searchSubMenu(req.params.id);
    res.json(result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.menuRepo.delete(req.params.id);
    res.json({ success: true });
  };
}

export default MenuController;
