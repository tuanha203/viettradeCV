import * as express from 'express';

import adminRouter from './admin';
import authRouter from './auth';
import categoryRouter from './category';
import categoryDocumentRouter from './categoryDocument';
import companyRouter from './company';
import departmentRouter from './department';
import digitalRouter from './digital';
import documentRouter from './document';
import galleryRouter from './gallery';
import menuRouter from './menu';
import postRouter from './post';
import projectRouter from './project';
import publicationRouter from './publication';
import questionRouter from './question';
import slideRouter from './slide';
import structureRouter from './structure';
import userRouter from './user';

export default function(db: SQLize) {
  const router = express.Router();

  router.use('/auth', authRouter(db));
  router.use('/user', userRouter(db));
  router.use('/admin', adminRouter(db));
  router.use('/category', categoryRouter(db));
  router.use('/category-document', categoryDocumentRouter(db));
  router.use('/company', companyRouter(db));
  router.use('/post', postRouter(db));
  router.use('/slide', slideRouter(db));
  router.use('/department', departmentRouter(db));
  router.use('/document', documentRouter(db));
  router.use('/gallery', galleryRouter(db));
  router.use('/publication', publicationRouter(db));
  router.use('/question', questionRouter(db));
  router.use('/structure', structureRouter(db));
  router.use('/menu', menuRouter(db));
  router.use('/digital', digitalRouter(db));
  router.use('/project', projectRouter(db));
  return router;
}
