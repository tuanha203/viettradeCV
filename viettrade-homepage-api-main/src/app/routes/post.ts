import { Router } from 'express';

import PostController from '../controllers/post';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as postValidator from '../validators/post';
import multer = require('multer');
import { editFileName } from '../utils';

export default function(db: SQLize) {
  const postRouter = Router();
  const postController = new PostController(db);

  const storage = multer.diskStorage({
    destination: './public/files',
    filename: editFileName
  });
  const upload = multer({ storage });
  /**
   * postCreate API
   */
  postRouter.post(
    '/',
    upload.fields([
      {
        name: 'feature_image'
      },
      {
        name: 'feature_document'
      }
    ]),
    routeGuard(apiList.postCreate),
    postValidator.create,
    validators,
    postController.create
  );

  postRouter.post('/upload', upload.single('file'), postController.uploadFile);

  /**
   * postCountView API
   */
  postRouter.post('/count-view/:id', validators, postController.countView);

  /**
   * postUpdate API
   */
  postRouter.put(
    '/:id',
    upload.fields([
      {
        name: 'feature_image'
      },
      {
        name: 'feature_document'
      }
    ]),
    routeGuard(apiList.postUpdate),
    validators,
    postController.update
  );

  /**
   * postSearch API
   */
  postRouter.get('/', postValidator.search, validators, postController.search);

  /**
   * postSearchId API
   */
  postRouter.get('/:id([0-9]+)', postController.searchId);

  /**
   * postDelete API
   */
  postRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.postDelete),
    postController.delete
  );

  postRouter.put(
    '/approve/:id([0-9]+)',
    routeGuard(apiList.postUpdate),
    postController.approve
  );

  return postRouter;
}
