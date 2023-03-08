import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/structure';
import BaseController from './_base';

class StructureController extends BaseController {
  private readonly structureRepo: repository.Structure;

  constructor(db: SQLize) {
    super(db);
    this.structureRepo = new repository.Structure(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.updateDisplay = this.nextWrapper(this.updateDisplay);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.structureRepo.create(mapper.createFormData(req));
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.structureRepo.update(
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
    const struc = await this.structureRepo.updateDisplay(
      mapper.updateDisplayFormData(req)
    );
    res.json(struc);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.structureRepo.search(<
      types.structure.SearchParams
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
    const result = await this.structureRepo.searchAll(<
      types.structure.SearchParams
    >{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };

  public searchSubStructure = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.structureRepo.searchSub(req.params.id);
    res.json(result);
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const structure = await this.structureRepo.searchId(req.params.id);
    res.json(structure);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.structureRepo.delete(req.params.id);
    res.json({ success: true });
  };
}

export default StructureController;
