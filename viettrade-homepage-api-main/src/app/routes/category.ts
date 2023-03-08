import { Router } from 'express';

import CategoryController from '../controllers/category';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as categoryValidator from '../validators/category';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const categoryRouter = Router();
  const categoryController = new CategoryController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
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
   * categoryCreate API
   */
  categoryRouter.post(
    '/',
    upload.single('feature_image'),
    routeGuard(apiList.categoryCreate),
    categoryValidator.create,
    validators,
    categoryController.create
  );

  /**
   * categoryUpdate API
   */
  categoryRouter.put(
    '/:id',
    upload.single('feature_image'),
    routeGuard(apiList.categoryUpdate),
    validators,
    categoryController.update
  );

  /**
   * categoryUpdate API
   */
  categoryRouter.put(
    '/display/:id',
    routeGuard(apiList.categoryUpdate),
    validators,
    categoryController.updateDisplay
  );

  categoryRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.categoryDelete),
    categoryController.delete
  );

  /**
   * CategorySearchId API
   */
  categoryRouter.get('/:id([0-9]+)', categoryController.searchId);

  /**
   * CategorySearch API
   */
  categoryRouter.get('/', validators, categoryController.search);
  return categoryRouter;
}
