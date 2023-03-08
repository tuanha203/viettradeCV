import { Router } from 'express';

import AdminController from '../controllers/admin';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as adminValidator from '../validators/admin';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const adminRouter = Router();
  const adminController = new AdminController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
    filename: editFileName
  });
  const upload = multer({ storage });
  /**
   * adminCreate API
   */
  adminRouter.post(
    '/',
    upload.single('feature_image'),
    routeGuard(apiList.adminCreate),
    adminValidator.create,
    validators,
    adminController.create
  );

  /**
   * adminSearch API
   */
  adminRouter.get(
    '/',
    routeGuard(apiList.adminSearch),
    adminValidator.search,
    validators,
    adminController.search
  );

  /**
   * adminSearchId API
   */
  adminRouter.get(
    '/:id([0-9]+)',
    routeGuard(apiList.adminSearchId),
    adminController.searchId
  );

  /**
   * adminSearchId API
   */
  adminRouter.get(
    '/adminInfo',
    routeGuard(apiList.adminSearchId),
    adminController.getAdminInfo
  );

  /**
   * adminDelete API
   */
  adminRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.adminDelete),
    adminController.delete
  );

  /**
   * adminUpdate API
   */
  adminRouter.put(
    '/:id([0-9]+)',
    upload.single('feature_image'),
    routeGuard(apiList.adminUpdate),
    adminController.update
  );

  return adminRouter;
}
