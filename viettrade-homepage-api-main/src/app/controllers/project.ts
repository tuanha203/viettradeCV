/* eslint-disable prefer-const */
import { NextFunction, Request, Response } from 'express';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/project';
import BaseController from './_base';

class ProjectController extends BaseController {
  private readonly projectRepo: repository.Project;

  constructor(db: SQLize) {
    super(db);
    this.projectRepo = new repository.Project(this.db);

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
    const result = await this.projectRepo.create(
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
    const result = await this.projectRepo.update(
      req.params.id,
      mapper.updateFormData(req),
      files.feature_image ? files.feature_image[0].path : undefined,
      feature_documents.length ? JSON.stringify(feature_documents) : undefined
    );
    this.created(res, result);
  };

  public searchId = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const project = await this.projectRepo.searchId(req.params.id);
    res.json(project);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.projectRepo.search(<types.project.SearchParams>{
      ...mapper.searchData(req),
      ...this.getOffsetLimit(req)
    });

    this.ok(res, result);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.projectRepo.delete(req.params.id);
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
}

export default ProjectController;
