import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/publication';
import BaseController from './_base';

class PublicationController extends BaseController {
  private readonly publicationRepo: repository.Publication;

  constructor(db: SQLize) {
    super(db);
    this.publicationRepo = new repository.Publication(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result = await this.publicationRepo.create(
      mapper.createFormData(req),
      files.feature_image ? '/' + files.feature_image[0].path : undefined,
      files.pdf_file ? '/' + files.pdf_file[0].path : undefined
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const result = await this.publicationRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      files.feature_image ? '/' + files.feature_image[0].path : undefined,
      files.pdf_file ? '/' + files.pdf_file[0].path : undefined
    );
    this.created(res, result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.publicationRepo.search(<
      types.gallery.SearchParams
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
    const post = await this.publicationRepo.searchId(req.params.id);
    res.json(post);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.publicationRepo.delete(req.params.id);
    res.json({ success: true });
  };
}

export default PublicationController;
