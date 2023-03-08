import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/gallery';
import BaseController from './_base';

class GalleryController extends BaseController {
  private readonly galleryRepo: repository.Gallery;

  constructor(db: SQLize) {
    super(db);
    this.galleryRepo = new repository.Gallery(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.galleryRepo.create(mapper.createFormData(req));
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.galleryRepo.update(
      req.params.id,
      mapper.updateFormData(req)
    );
    this.created(res, result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.galleryRepo.search(<types.gallery.SearchParams>{
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
    const post = await this.galleryRepo.searchId(req.params.id);
    res.json(post);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.galleryRepo.delete(req.params.id);
    res.json({ success: true });
  };
}

export default GalleryController;
