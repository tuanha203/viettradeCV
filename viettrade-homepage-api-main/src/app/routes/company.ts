import { Router } from 'express';

import CompanyController from '../controllers/company';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as companyValidator from '../validators/company';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const companyRouter = Router();
  const companyController = new CompanyController(db);

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
   * postCreate API
   */
  companyRouter.post(
    '/',
    upload.single('feature_image'),
    routeGuard(apiList.companyCreate),
    companyValidator.create,
    validators,
    companyController.create
  );

  /**
   * companyUpdate API
   */
  companyRouter.put(
    '/:id',
    upload.single('feature_image'),
    routeGuard(apiList.companyUpdate),
    validators,
    companyController.update
  );
  /**
   * companyUpdate API
   */
  companyRouter.put(
    '/display/:id',
    routeGuard(apiList.companyUpdate),
    validators,
    companyController.updateDisplay
  );

  /**
   * companySearch API
   */
  companyRouter.get(
    '/',
    companyValidator.search,
    validators,
    companyController.search
  );

  /**
   * companySearch API
   */
  companyRouter.get(
    '/all',
    companyValidator.search,
    validators,
    companyController.searchAll
  );

  /**
   * companySearchId API
   */
  companyRouter.get('/:id([0-9]+)', validators, companyController.searchId);

  /**
   * companyDelete API
   */
  companyRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.companyDelete),
    companyController.delete
  );

  companyRouter.put(
    '/approve/:id([0-9]+)',
    routeGuard(apiList.companyUpdate),
    companyController.approve
  );

  return companyRouter;
}
