"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const structure_1 = require("../controllers/structure");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const structureValidator = require("../validators/structure");
function default_1(db) {
    const structureRouter = (0, express_1.Router)();
    const structureController = new structure_1.default(db);
    /**
     * structureCreate API
     */
    structureRouter.post('/', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.structureCreate), structureValidator.create, validator_1.default, structureController.create);
    /**
     * structureChangePosition
     */
    structureRouter.put('/display', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.structureUpdateDisplay), structureController.updateDisplay);
    /**
     * structureUpdate API
     */
    structureRouter.put('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.structureUpdate), validator_1.default, structureController.update);
    structureRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.structureDelete), structureController.delete);
    /**
     * structureSearchId API
     */
    structureRouter.get('/:id([0-9]+)', structureController.searchId);
    /**
     * structureSearch API
     */
    structureRouter.get('/', structureValidator.search, validator_1.default, structureController.search);
    /**
     * structureSearchId API
     */
    structureRouter.get('/substructure/:id([0-9]+)', structureController.searchSubStructure);
    /**
     * structureSearch API
     */
    structureRouter.get('/all', validator_1.default, structureController.searchAll);
    return structureRouter;
}
exports.default = default_1;
//# sourceMappingURL=structure.js.map