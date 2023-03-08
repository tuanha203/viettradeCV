"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const adminValidator = require("../validators/admin");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const adminRouter = (0, express_1.Router)();
    const adminController = new admin_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    /**
     * adminCreate API
     */
    adminRouter.post('/', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.adminCreate), adminValidator.create, validator_1.default, adminController.create);
    /**
     * adminSearch API
     */
    adminRouter.get('/', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.adminSearch), adminValidator.search, validator_1.default, adminController.search);
    /**
     * adminSearchId API
     */
    adminRouter.get('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.adminSearchId), adminController.searchId);
    /**
     * adminSearchId API
     */
    adminRouter.get('/adminInfo', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.adminSearchId), adminController.getAdminInfo);
    /**
     * adminDelete API
     */
    adminRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.adminDelete), adminController.delete);
    /**
     * adminUpdate API
     */
    adminRouter.put('/:id([0-9]+)', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.adminUpdate), adminController.update);
    return adminRouter;
}
exports.default = default_1;
//# sourceMappingURL=admin.js.map