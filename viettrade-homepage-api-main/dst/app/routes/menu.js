"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const menu_1 = require("../controllers/menu");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const menuValidator = require("../validators/menu");
function default_1(db) {
    const menuRouter = (0, express_1.Router)();
    const menuController = new menu_1.default(db);
    /**
     * menuCreate API
     */
    menuRouter.post('/', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.menuCreate), menuValidator.create, validator_1.default, menuController.create);
    /**
     * menuUpdate API
     */
    menuRouter.put('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.menuUpdate), validator_1.default, menuController.update);
    /**
     * menuChangePosition
     */
    menuRouter.put('/display', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.menuUpdateDisplay), menuController.updateDisplay);
    /**
     * menuSearch API
     */
    menuRouter.get('/', menuValidator.search, validator_1.default, menuController.search);
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
    menuRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.menuDelete), menuController.delete);
    return menuRouter;
}
exports.default = default_1;
//# sourceMappingURL=menu.js.map