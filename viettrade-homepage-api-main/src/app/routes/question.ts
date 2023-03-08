import { Router } from 'express';

import QuestionController from '../controllers/question';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as questionValidator from '../validators/question';

export default function(db: SQLize) {
  const questionRouter = Router();
  const questionController = new QuestionController(db);

  /**
   * questionCreate API
   */
  questionRouter.post(
    '/',
    routeGuard(apiList.questionCreate),
    questionValidator.create,
    validators,
    questionController.create
  );

  /**
   * questionUpdate API
   */
  questionRouter.put(
    '/:id([0-9]+)',
    routeGuard(apiList.questionUpdate),
    questionValidator.update,
    validators,
    questionController.update
  );

  /**
   * questionSearch API
   */
  questionRouter.get(
    '/',
    questionValidator.search,
    validators,
    questionController.search
  );

  /**
   * questionSearchId API
   */
  questionRouter.get('/:id([0-9]+)', questionController.searchId);

  /**
   * questionDelete API
   */
  questionRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.questionDelete),
    questionController.delete
  );

  return questionRouter;
}
