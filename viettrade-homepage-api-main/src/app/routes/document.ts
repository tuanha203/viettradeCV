import { Router } from 'express';

import DocumentController from '../controllers/document';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as documentValidator from '../validators/document';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const documentRouter = Router();
  const documentController = new DocumentController(db);
  const today = new Date().toLocaleDateString('zh-Hans-CN');
  const storage = multer.diskStorage({
    destination: './public/files/documents/' + today,
    filename: editFileName
  });
  const upload = multer({ storage });
  /**
   * Document Create API
   */
  documentRouter.post(
    '/',
    upload.single('feature_document'),
    routeGuard(apiList.documentCreate),
    documentValidator.create,
    validators,
    documentController.create
  );

  /**
   * Document Update API
   */
  documentRouter.put(
    '/:id',
    upload.single('feature_document'),
    routeGuard(apiList.documentUpdate),
    validators,
    documentController.update
  );

  documentRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.documentDelete),
    documentController.delete
  );

  /**
   * Document SearchId API
   */
  documentRouter.get('/:id([0-9]+)', documentController.searchId);

  /**
   * Document Search API
   */
  documentRouter.get('/', validators, documentController.search);
  return documentRouter;
}
