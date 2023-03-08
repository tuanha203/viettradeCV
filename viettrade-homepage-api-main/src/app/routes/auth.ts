import { Router } from 'express';

import AuthController from '../controllers/auth';
import validators from '../middlewares/validator';
import * as authValidator from '../validators/auth';

export default function(db: SQLize) {
  const authRouter = Router();
  const authController = new AuthController(db);

  authRouter.post(
    '/logout',
    authValidator.logout,
    validators,
    authController.logout
  );

  authRouter.post('/forgot-password', authController.forgotPassword);

  authRouter.post('/reset-password', authController.resetPassword);

  authRouter.post('/validation-token', authController.checkToken);

  return authRouter;
}
