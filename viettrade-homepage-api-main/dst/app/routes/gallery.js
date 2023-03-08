"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gallery_1 = require("../controllers/gallery");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const galleryValidator = require("../validators/gallery");
function default_1(db) {
    const galleryRouter = (0, express_1.Router)();
    const galleryController = new gallery_1.default(db);
    /**
     * galleryCreate API
     */
    galleryRouter.post('/', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.galleryCreate), galleryValidator.create, validator_1.default, galleryController.create);
    /**
     * galleryUpdate API
     */
    galleryRouter.put('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.galleryUpdate), galleryValidator.update, validator_1.default, galleryController.update);
    /**
     * gallerySearch API
     */
    galleryRouter.get('/', galleryValidator.search, validator_1.default, galleryController.search);
    /**
     * gallerySearchId API
     */
    galleryRouter.get('/:id([0-9]+)', galleryController.searchId);
    /**
     * galleryDelete API
     */
    galleryRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.galleryDelete), galleryController.delete);
    return galleryRouter;
}
exports.default = default_1;
//# sourceMappingURL=gallery.js.map