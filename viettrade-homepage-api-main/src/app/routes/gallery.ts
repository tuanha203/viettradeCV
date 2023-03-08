import { Router } from 'express';

import GalleryController from '../controllers/gallery';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as galleryValidator from '../validators/gallery';

export default function(db: SQLize) {
  const galleryRouter = Router();
  const galleryController = new GalleryController(db);

  /**
   * galleryCreate API
   */
  galleryRouter.post(
    '/',
    routeGuard(apiList.galleryCreate),
    galleryValidator.create,
    validators,
    galleryController.create
  );

  /**
   * galleryUpdate API
   */
  galleryRouter.put(
    '/:id([0-9]+)',
    routeGuard(apiList.galleryUpdate),
    galleryValidator.update,
    validators,
    galleryController.update
  );

  /**
   * gallerySearch API
   */
  galleryRouter.get(
    '/',
    galleryValidator.search,
    validators,
    galleryController.search
  );

  /**
   * gallerySearchId API
   */
  galleryRouter.get('/:id([0-9]+)', galleryController.searchId);

  /**
   * galleryDelete API
   */
  galleryRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.galleryDelete),
    galleryController.delete
  );

  return galleryRouter;
}
