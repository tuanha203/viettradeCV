import { Router } from 'express';

import SlideController from '../controllers/slide';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as slideValidator from '../validators/slide';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const slideRouter = Router();
  const slideController = new SlideController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
    filename: editFileName
  });
  const upload = multer({ storage });
  /**
   * slideCreate API
   */
  slideRouter.post(
    '/',
    upload.single('feature_image'),
    routeGuard(apiList.slideCreate),
    slideValidator.create,
    validators,
    slideController.create
  );

  /**
   * slideUpdate API
   */
  slideRouter.put(
    '/:id([0-9]+)',
    upload.single('feature_image'),
    routeGuard(apiList.slideUpdate),
    validators,
    slideController.update
  );

  /**
   * slideChangePosition
   */
  slideRouter.put(
    '/display',
    routeGuard(apiList.slideUpdateDisplay),
    // slideValidator.updateDisplay,
    slideController.updateDisplay
  );

  /**
   * slideSearch API
   */
  slideRouter.get(
    '/',
    slideValidator.search,
    validators,
    slideController.search
  );

  /**
   * gallerySearchId API
   */
  slideRouter.get('/:id([0-9]+)', slideController.searchId);

  /**
   * slideDelete API
   */
  slideRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.slideDelete),
    slideController.delete
  );

  return slideRouter;
}
