import { Router } from 'express';

import DepartmentController from '../controllers/department';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as departmentValidator from '../validators/department';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const departmentRouter = Router();
  const departmentController = new DepartmentController(db);
  const today = new Date().toLocaleDateString('zh-Hans-CN');

  const storage = multer.diskStorage({
    destination: './public/files/department/' + today,
    filename: editFileName
  });
  const upload = multer({
    storage,
    fileFilter: (_req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });

  /**
   * departmentCreate API
   */
  departmentRouter.post(
    '/',
    upload.single('feature_image'),
    routeGuard(apiList.departmentCreate),
    departmentValidator.create,
    validators,
    departmentController.create
  );

  /**
   * departmentUpdate API
   */
  departmentRouter.put(
    '/:id',
    upload.single('feature_image'),
    routeGuard(apiList.departmentUpdate),
    validators,
    departmentController.update
  );

  departmentRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.departmentDelete),
    departmentController.delete
  );

  /**
   * departmentSearchId API
   */
  departmentRouter.get('/:id([0-9]+)', departmentController.searchId);

  /**
   * departmentSearch API
   */
  departmentRouter.get('/', validators, departmentController.search);

  /**
   * departmentSearch API
   */
  departmentRouter.get('/all', validators, departmentController.searchAll);
  return departmentRouter;
}
