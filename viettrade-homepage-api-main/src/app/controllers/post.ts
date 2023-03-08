/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/post';
import BaseController from './_base';

class PostController extends BaseController {
  private readonly postRepo: repository.Post;

  constructor(db: SQLize) {
    super(db);
    this.postRepo = new repository.Post(this.db);

    this.create = this.nextWrapper(this.create);
    this.update = this.nextWrapper(this.update);
    this.searchId = this.nextWrapper(this.searchId);
    this.search = this.nextWrapper(this.search);
    this.delete = this.nextWrapper(this.delete);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let feature_documents: string[] = [];
    files.feature_document?.map((document) => {
      feature_documents.push(process.env.IMAGE_URL + document.path);
    });
    const result = await this.postRepo.create(
      mapper.createFormData(req),
      files.feature_image ? files.feature_image[0].path : undefined,
      feature_documents ? JSON.stringify(feature_documents) : undefined
    );
    this.created(res, result);
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let feature_documents: string[] = [];
    files.feature_document?.map((document) => {
      feature_documents.push(process.env.IMAGE_URL + document.path);
    });
    const result = await this.postRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      files.feature_image ? files.feature_image[0].path : undefined,
      feature_documents.length ? JSON.stringify(feature_documents) : undefined
    );
    this.created(res, result);
  };

  public countView = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.postRepo.countView(req.params.id);
    this.created(res, result);
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const post = await this.postRepo.searchId(req.params.id);
    res.json(post);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.postRepo.search(<types.post.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });
    this.ok(res, result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.postRepo.delete(req.params.id);
    res.json({ success: true });
  };
  public uploadFile = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    res.json({ location: '/public/files/' + req.file?.filename });
    // process.env.HOSTNAME +
  };

  public approve = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.postRepo.approve(req.params.id, req.body.status);

    this.created(res, result);
  };
}

export default PostController;
