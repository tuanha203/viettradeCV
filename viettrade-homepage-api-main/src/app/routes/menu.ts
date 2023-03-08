import { Router } from 'express';

import MenuController from '../controllers/menu';
import { apiList, routeGuard } from '../middlewares/routeGuard';
import validators from '../middlewares/validator';
import * as menuValidator from '../validators/menu';

export default function(db: SQLize) {
  const menuRouter = Router();
  const menuController = new MenuController(db);

  /**
   * menuCreate API
   */
  menuRouter.post(
    '/',
    routeGuard(apiList.menuCreate),
    menuValidator.create,
    validators,
    menuController.create
  );

  /**
   * menuUpdate API
   */
  menuRouter.put(
    '/:id([0-9]+)',
    routeGuard(apiList.menuUpdate),
    validators,
    menuController.update
  );

  /**
   * menuChangePosition
   */
  menuRouter.put(
    '/display',
    routeGuard(apiList.menuUpdateDisplay),
    menuController.updateDisplay
  );

  /**
   * menuSearch API
   */
  menuRouter.get('/', menuValidator.search, validators, menuController.search);

  /**
   * menuSearchId API
   */
  menuRouter.get('/:id([0-9]+)', menuController.searchId);

  /**
   * menuSearchId API
   */
  menuRouter.get('/submenu/:id([0-9]+)', menuController.searchSubMenu);

  /**
   * menuDelete API
   */
  menuRouter.delete(
    '/:id([0-9]+)',
    routeGuard(apiList.menuDelete),
    menuController.delete
  );

  return menuRouter;
}
