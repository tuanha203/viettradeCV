"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const department_1 = require("../controllers/department");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const departmentValidator = require("../validators/department");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const departmentRouter = (0, express_1.Router)();
    const departmentController = new department_1.default(db);
    const today = new Date().toLocaleDateString('zh-Hans-CN');
    const storage = multer.diskStorage({
        destination: './public/files/department/' + today,
        filename: utils_1.editFileName
    });
    const upload = multer({
        storage,
        fileFilter: (_req, file, cb) => {
            if (file.mimetype == 'image/png' ||
                file.mimetype == 'image/jpg' ||
                file.mimetype == 'image/jpeg') {
                cb(null, true);
            }
            else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }
    });
    /**
     * departmentCreate API
     */
    departmentRouter.post('/', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.departmentCreate), departmentValidator.create, validator_1.default, departmentController.create);
    /**
     * departmentUpdate API
     */
    departmentRouter.put('/:id', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.departmentUpdate), validator_1.default, departmentController.update);
    departmentRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.departmentDelete), departmentController.delete);
    /**
     * departmentSearchId API
     */
    departmentRouter.get('/:id([0-9]+)', departmentController.searchId);
    /**
     * departmentSearch API
     */
    departmentRouter.get('/', validator_1.default, departmentController.search);
    /**
     * departmentSearch API
     */
    departmentRouter.get('/all', validator_1.default, departmentController.searchAll);
    return departmentRouter;
}
exports.default = default_1;
//# sourceMappingURL=department.js.map