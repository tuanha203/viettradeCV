import { Router } from 'express';

import ProjectController from '../controllers/project';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as projectValidator from '../validators/project';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const projectRouter = Router();
  const projectController = new ProjectController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
    filename: editFileName
  });
  const upload = multer({ storage });
  /**
   * projectCreate API
   */
  projectRouter.post(
    '/',
    upload.fields([
      {
        name: 'feature_image'
      },
      {
        name: 'feature_document'
      }
    ]),
    routeGuard(apiList.projectCreate),
    projectValidator.create,
    validators,
    projectController.create
  );

  projectRouter.post(
    '/upload',
    upload.single('file'),
    projectController.uploadFile
  );

  /**
   * projectUpdate API
   */
  projectRouter.put(
    '/:id',
    upload.fields([
      {
        name: 'feature_image'
      },
      {
        name: 'feature_document'
      }
    ]),
    routeGuard(apiList.projectUpdate),
    validators,
    projectController.update
  );

  /**
   * projectSearch API
   */
  projectRouter.get(
    '/',
    projectValidator.search,
    validators,
    projectController.search
  );

  /**
   * projectSearchId API
   */
  projectRouter.get('/:id([0-9]+)', projectController.searchId);

  /**
   * projectDelete API
   */
  projectRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.projectDelete),
    projectController.delete
  );
  return projectRouter;
}
