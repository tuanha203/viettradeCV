import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { types } from '../../common';
import { repository } from '../../domain';
import * as mapper from '../mapper/admin';
import BaseController from './_base';

class AdminController extends BaseController {
  private readonly adminRepo: repository.Admin;
  private readonly expiresIn: string = process.env.JWT_EXPIRATION || '3600s'; // default to 60 minutes
  private readonly jwtSecret: string = process.env.JWT_SECRET || 'viettrade';
  private readonly refreshTokenMaxAge: number = Number(
    process.env.REFRESH_TOKEN_MAX_AGE || '30'
  ); // default to 30

  constructor(db: SQLize) {
    super(db);
    this.adminRepo = new repository.Admin(this.db);

    this.create = this.nextWrapper(this.create);
    this.search = this.nextWrapper(this.search);
    this.searchId = this.nextWrapper(this.searchId);
    this.delete = this.nextWrapper(this.delete);
    this.update = this.nextWrapper(this.update);
  }

  public create = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.adminRepo.create(
      {
        ...mapper.createFormData(req)
      },
      req.file ? '/public/files/' + req.file.filename : undefined
    );
    this.created(res, result);
  };

  public search = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.adminRepo.search(<types.admin.SearchParams>{
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
    const user = await this.adminRepo.searchId(req.params.id);
    res.json(user);
  };

  public delete = async (req: Request, res: Response, _next: NextFunction) => {
    await this.adminRepo.delete(req.params.id);
    res.json({ success: true });
  };

  public update = async (req: Request, res: Response, _next: NextFunction) => {
    const result = await this.adminRepo.update(
      mapper.updateFormData(req),
      req.params.id,
      req.file ? './public/files/' + req.file.filename : undefined
    );
    this.created(res, result);
  };

  public createAdmin = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.adminRepo.createAdmin(
      mapper.createFormData(req),
      req.file ? '/public/files/' + req.file.filename : undefined
    );
    this.created(res, result);
  };

  public login = async (req: Request, res: Response, _next: NextFunction) => {
    let admin: any = await this.adminRepo.login({
      email: req.body.email,
      password: req.body.password
    });

    if (!(admin.success === false)) {
      admin = JSON.parse(JSON.stringify(admin));
      const token = await this.signToken(admin);
      res.setHeader('X-Token-Expiration', this.refreshTokenMaxAge);
      res.json({
        ...admin,
        token
      });

      const extend: any = {
        apiNm: 'login',
        params: {
          email: admin.email
        }
      };

      req.user = <any>admin;
      this.logClientInfo(req, extend);
    } else {
      res.json(admin);
    }
  };

  private signToken = async (data: { id: number }) => {
    const token = jwt.sign(data, this.jwtSecret, {
      expiresIn: this.expiresIn
    });
    const result = {
      accessToken: token
    };

    return result;
  };

  public getAdminInfo = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    if (req.user) {
      const user = await this.adminRepo.searchId(req.user?.id);
      res.json(user);
    } else {
      res.json(null);
    }
  };
}

export default AdminController;
