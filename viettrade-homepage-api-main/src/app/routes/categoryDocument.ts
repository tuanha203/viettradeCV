import { Router } from 'express';

import CategoryDocumentController from '../controllers/categoryDocument';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as categoryDocumentValidator from '../validators/categoryDocument';

export default function(db: SQLize) {
  const categoryDocumentRouter = Router();
  const categoryDocumentController = new CategoryDocumentController(db);

  /**
   * Category Document Create API
   */
  categoryDocumentRouter.post(
    '/',
    routeGuard(apiList.categoryDocumentCreate),
    categoryDocumentValidator.create,
    validators,
    categoryDocumentController.create
  );

  /**
   * Category Document Update API
   */
  categoryDocumentRouter.put(
    '/:id',
    routeGuard(apiList.categoryDocumentUpdate),
    validators,
    categoryDocumentController.update
  );

  categoryDocumentRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.categoryDocumentDelete),
    categoryDocumentController.delete
  );

  /**
   * Category Document SearchId API
   */
  categoryDocumentRouter.get(
    '/:id([0-9]+)',
    categoryDocumentController.searchId
  );

  /**
   * Category Document Search API
   */
  categoryDocumentRouter.get(
    '/',
    validators,
    categoryDocumentController.search
  );
  return categoryDocumentRouter;
}
