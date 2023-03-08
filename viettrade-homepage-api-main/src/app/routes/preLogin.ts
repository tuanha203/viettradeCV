import { Router } from 'express';

import AdminController from '../controllers/admin';
import AuthController from '../controllers/auth';
import UserController from '../controllers/user';
import validators from '../middlewares/validator';
import * as adminValidator from '../validators/admin';
import * as authValidator from '../validators/auth';
import * as userValidator from '../validators/user';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const authRouter = Router();
  const authController = new AuthController(db);
  const userController = new UserController(db);
  const adminController = new AdminController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
    filename: editFileName
  });
  const upload = multer({ storage });

  authRouter.post(
    '/auth/login',
    authValidator.login,
    validators,
    authController.login
  );

  authRouter.post(
    '/auth/login/admin',
    authValidator.login,
    validators,
    adminController.login
  );

  authRouter.post(
    '/create/admin',
    upload.single('feature_image'),
    adminValidator.create,
    validators,
    adminController.createAdmin
  );

  authRouter.post(
    '/register',
    userValidator.register,
    validators,
    userController.register
  );

  authRouter.post(
    '/contact',
    userValidator.contact,
    validators,
    authController.sendEmail
  );

  authRouter.post(
    '/auth/refreshToken',
    authValidator.refreshToken,
    validators,
    authController.refresh
  );

  return authRouter;
}
