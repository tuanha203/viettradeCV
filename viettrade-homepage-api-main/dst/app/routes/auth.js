"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../controllers/auth");
const validator_1 = require("../middlewares/validator");
const authValidator = require("../validators/auth");
function default_1(db) {
    const authRouter = (0, express_1.Router)();
    const authController = new auth_1.default(db);
    authRouter.post('/logout', authValidator.logout, validator_1.default, authController.logout);
    authRouter.post('/forgot-password', authController.forgotPassword);
    authRouter.post('/reset-password', authController.resetPassword);
    authRouter.post('/validation-token', authController.checkToken);
    return authRouter;
}
exports.default = default_1;
//# sourceMappingURL=auth.js.map