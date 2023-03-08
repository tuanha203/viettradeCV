"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = require("../controllers/admin");
const auth_1 = require("../controllers/auth");
const user_1 = require("../controllers/user");
const validator_1 = require("../middlewares/validator");
const adminValidator = require("../validators/admin");
const authValidator = require("../validators/auth");
const userValidator = require("../validators/user");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const authRouter = (0, express_1.Router)();
    const authController = new auth_1.default(db);
    const userController = new user_1.default(db);
    const adminController = new admin_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    authRouter.post('/auth/login', authValidator.login, validator_1.default, authController.login);
    authRouter.post('/auth/login/admin', authValidator.login, validator_1.default, adminController.login);
    authRouter.post('/create/admin', upload.single('feature_image'), adminValidator.create, validator_1.default, adminController.createAdmin);
    authRouter.post('/register', userValidator.register, validator_1.default, userController.register);
    authRouter.post('/contact', userValidator.contact, validator_1.default, authController.sendEmail);
    authRouter.post('/auth/refreshToken', authValidator.refreshToken, validator_1.default, authController.refresh);
    return authRouter;
}
exports.default = default_1;
//# sourceMappingURL=preLogin.js.map