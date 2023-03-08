"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const slide_1 = require("../controllers/slide");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const slideValidator = require("../validators/slide");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const slideRouter = (0, express_1.Router)();
    const slideController = new slide_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    /**
     * slideCreate API
     */
    slideRouter.post('/', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.slideCreate), slideValidator.create, validator_1.default, slideController.create);
    /**
     * slideUpdate API
     */
    slideRouter.put('/:id([0-9]+)', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.slideUpdate), validator_1.default, slideController.update);
    /**
     * slideChangePosition
     */
    slideRouter.put('/display', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.slideUpdateDisplay), 
    // slideValidator.updateDisplay,
    slideController.updateDisplay);
    /**
     * slideSearch API
     */
    slideRouter.get('/', slideValidator.search, validator_1.default, slideController.search);
    /**
     * gallerySearchId API
     */
    slideRouter.get('/:id([0-9]+)', slideController.searchId);
    /**
     * slideDelete API
     */
    slideRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.slideDelete), slideController.delete);
    return slideRouter;
}
exports.default = default_1;
//# sourceMappingURL=slide.js.map