import { Router } from 'express';
import { NextFunction, Request, Response } from 'express';

import PublicationController from '../controllers/publication';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as publicationValidator from '../validators/publication';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const publicationRouter = Router();
  const publicationController = new PublicationController(db);
  const today = new Date().toLocaleDateString('zh-Hans-CN');
  const storage = multer.diskStorage({
    destination: './public/files/publications/' + today,
    filename: editFileName
  });
  const upload_image = multer({
    storage,
    fileFilter: (_req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'application/pdf'
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
  });

  /**
   * publicationCreate API
   */
  publicationRouter.post(
    '/',
    upload_image.fields([{ name: 'feature_image' }, { name: 'pdf_file' }]),
    routeGuard(apiList.publicationCreate),
    publicationValidator.create,
    validators,
    publicationController.create
  );

  publicationRouter.post(
    '/upload',
    upload_image.single('file'),
    (req: Request, res: Response, _next: NextFunction) => {
      res.json({ location: '/public/files/' + req.file?.filename });
    }
  );

  /**
   * publicationUpdate API
   */
  publicationRouter.put(
    '/:id([0-9]+)',
    upload_image.fields([{ name: 'feature_image' }, { name: 'pdf_file' }]),
    routeGuard(apiList.publicationUpdate),
    publicationValidator.update,
    validators,
    publicationController.update
  );

  /**
   * publicationSearch API
   */
  publicationRouter.get(
    '/',
    publicationValidator.search,
    validators,
    publicationController.search
  );

  /**
   * publicationSearchId API
   */
  publicationRouter.get('/:id([0-9]+)', publicationController.searchId);

  /**
   * publicationDelete API
   */
  publicationRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.publicationDelete),
    publicationController.delete
  );

  return publicationRouter;
}
