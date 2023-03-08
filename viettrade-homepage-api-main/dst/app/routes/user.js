"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_1 = require("../controllers/user");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const userValidator = require("../validators/user");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const userRouter = (0, express_1.Router)();
    const userController = new user_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    /**
     * userCreate API
     */
    userRouter.post('/', upload.fields([
        {
            name: 'image',
            maxCount: 1
        }
    ]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.userCreate), userValidator.create, validator_1.default, userController.create);
    /**
     * userSearch API
     */
    userRouter.get('/', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.userSearch), userValidator.search, validator_1.default, userController.search);
    /**
     * userUpdateSeft API
     */
    userRouter.put('/update-user', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.userUpdateSelf), userController.updateUser);
    /**
     * userSearchId API
     */
    userRouter.get('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.userSearchId), userController.searchId);
    /**
     * userDelete API
     */
    userRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.userDelete), userController.delete);
    /**
     * userUpdate API
     */
    userRouter.put('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.userUpdate), userController.update);
    return userRouter;
}
exports.default = default_1;
//# sourceMappingURL=user.js.map