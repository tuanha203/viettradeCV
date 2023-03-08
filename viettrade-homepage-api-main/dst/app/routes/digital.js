"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const digital_1 = require("../controllers/digital");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const digitalValidator = require("../validators/digital");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const digitalRouter = (0, express_1.Router)();
    const digitalController = new digital_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    /**
     * digitalCreate API
     */
    digitalRouter.post('/', upload.fields([
        {
            name: 'feature_image'
        },
        {
            name: 'feature_icon'
        }
    ]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.digitalCreate), digitalValidator.create, validator_1.default, digitalController.create);
    /**
     * digitalUpdate API
     */
    digitalRouter.put('/:id([0-9]+)', upload.fields([
        {
            name: 'feature_image'
        },
        {
            name: 'feature_icon'
        }
    ]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.digitalUpdate), digitalValidator.update, validator_1.default, digitalController.update);
    /**
     * slideChangePosition
     */
    digitalRouter.put('/display', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.digitalUpdateDisplay), validator_1.default, digitalController.updateDisplay);
    /**
     * digitalSearch API
     */
    digitalRouter.get('/', digitalValidator.search, validator_1.default, digitalController.search);
    /**
     * digitalSearchId API
     */
    digitalRouter.get('/:id([0-9]+)', digitalController.searchId);
    /**
     * digitalDelete API
     */
    digitalRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.digitalDelete), digitalController.delete);
    return digitalRouter;
}
exports.default = default_1;
//# sourceMappingURL=digital.js.map