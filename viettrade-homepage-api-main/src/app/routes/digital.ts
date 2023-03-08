import { Router } from 'express';

import DigitalController from '../controllers/digital';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as digitalValidator from '../validators/digital';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const digitalRouter = Router();
  const digitalController = new DigitalController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
    filename: editFileName
  });
  const upload = multer({ storage });
  /**
   * digitalCreate API
   */
  digitalRouter.post(
    '/',
    upload.fields([
      {
        name: 'feature_image'
      },
      {
        name: 'feature_icon'
      }
    ]),
    routeGuard(apiList.digitalCreate),
    digitalValidator.create,
    validators,
    digitalController.create
  );

  /**
   * digitalUpdate API
   */
  digitalRouter.put(
    '/:id([0-9]+)',
    upload.fields([
      {
        name: 'feature_image'
      },
      {
        name: 'feature_icon'
      }
    ]),
    routeGuard(apiList.digitalUpdate),
    digitalValidator.update,
    validators,
    digitalController.update
  );

  /**
   * slideChangePosition
   */
  digitalRouter.put(
    '/display',
    routeGuard(apiList.digitalUpdateDisplay),
    validators,
    digitalController.updateDisplay
  );

  /**
   * digitalSearch API
   */
  digitalRouter.get(
    '/',
    digitalValidator.search,
    validators,
    digitalController.search
  );

  /**
   * digitalSearchId API
   */
  digitalRouter.get('/:id([0-9]+)', digitalController.searchId);

  /**
   * digitalDelete API
   */
  digitalRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.digitalDelete),
    digitalController.delete
  );

  return digitalRouter;
}
