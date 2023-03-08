"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryDocument_1 = require("../controllers/categoryDocument");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const categoryDocumentValidator = require("../validators/categoryDocument");
function default_1(db) {
    const categoryDocumentRouter = (0, express_1.Router)();
    const categoryDocumentController = new categoryDocument_1.default(db);
    /**
     * Category Document Create API
     */
    categoryDocumentRouter.post('/', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.categoryDocumentCreate), categoryDocumentValidator.create, validator_1.default, categoryDocumentController.create);
    /**
     * Category Document Update API
     */
    categoryDocumentRouter.put('/:id', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.categoryDocumentUpdate), validator_1.default, categoryDocumentController.update);
    categoryDocumentRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.categoryDocumentDelete), categoryDocumentController.delete);
    /**
     * Category Document SearchId API
     */
    categoryDocumentRouter.get('/:id([0-9]+)', categoryDocumentController.searchId);
    /**
     * Category Document Search API
     */
    categoryDocumentRouter.get('/', validator_1.default, categoryDocumentController.search);
    return categoryDocumentRouter;
}
exports.default = default_1;
//# sourceMappingURL=categoryDocument.js.map