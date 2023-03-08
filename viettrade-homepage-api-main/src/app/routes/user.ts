import { Router } from 'express';

import UserController from '../controllers/user';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as userValidator from '../validators/user';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const userRouter = Router();
  const userController = new UserController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
    filename: editFileName
  });
  const upload = multer({ storage });
  /**
   * userCreate API
   */
  userRouter.post(
    '/',
    upload.fields([
      {
        name: 'image',
        maxCount: 1
      }
    ]),
    routeGuard(apiList.userCreate),
    userValidator.create,
    validators,
    userController.create
  );

  /**
   * userSearch API
   */
  userRouter.get(
    '/',
    routeGuard(apiList.userSearch),
    userValidator.search,
    validators,
    userController.search
  );

  /**
   * userUpdateSeft API
   */
  userRouter.put(
    '/update-user',
    routeGuard(apiList.userUpdateSelf),
    userController.updateUser
  );

  /**
   * userSearchId API
   */
  userRouter.get(
    '/:id([0-9]+)',
    routeGuard(apiList.userSearchId),
    userController.searchId
  );

  /**
   * userDelete API
   */
  userRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.userDelete),
    userController.delete
  );

  /**
   * userUpdate API
   */
  userRouter.put(
    '/:id([0-9]+)',
    routeGuard(apiList.userUpdate),
    userController.update
  );

  return userRouter;
}
