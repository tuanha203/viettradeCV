import { Router } from 'express';

import StructureController from '../controllers/structure';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as structureValidator from '../validators/structure';

export default function(db: SQLize) {
  const structureRouter = Router();
  const structureController = new StructureController(db);

  /**
   * structureCreate API
   */
  structureRouter.post(
    '/',
    routeGuard(apiList.structureCreate),
    structureValidator.create,
    validators,
    structureController.create
  );

  /**
   * structureChangePosition
   */
  structureRouter.put(
    '/display',
    routeGuard(apiList.structureUpdateDisplay),
    structureController.updateDisplay
  );

  /**
   * structureUpdate API
   */
  structureRouter.put(
    '/:id([0-9]+)',
    routeGuard(apiList.structureUpdate),
    validators,
    structureController.update
  );

  structureRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.structureDelete),
    structureController.delete
  );

  /**
   * structureSearchId API
   */
  structureRouter.get('/:id([0-9]+)', structureController.searchId);

  /**
   * structureSearch API
   */
  structureRouter.get(
    '/',
    structureValidator.search,
    validators,
    structureController.search
  );
  /**
   * structureSearchId API
   */
  structureRouter.get(
    '/substructure/:id([0-9]+)',
    structureController.searchSubStructure
  );

  /**
   * structureSearch API
   */
  structureRouter.get('/all', validators, structureController.searchAll);
  return structureRouter;
}
