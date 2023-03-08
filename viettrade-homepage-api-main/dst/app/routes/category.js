"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_1 = require("../controllers/category");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const categoryValidator = require("../validators/category");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const categoryRouter = (0, express_1.Router)();
    const categoryController = new category_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
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
     * categoryCreate API
     */
    categoryRouter.post('/', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.categoryCreate), categoryValidator.create, validator_1.default, categoryController.create);
    /**
     * categoryUpdate API
     */
    categoryRouter.put('/:id', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.categoryUpdate), validator_1.default, categoryController.update);
    /**
     * categoryUpdate API
     */
    categoryRouter.put('/display/:id', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.categoryUpdate), validator_1.default, categoryController.updateDisplay);
    categoryRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.categoryDelete), categoryController.delete);
    /**
     * CategorySearchId API
     */
    categoryRouter.get('/:id([0-9]+)', categoryController.searchId);
    /**
     * CategorySearch API
     */
    categoryRouter.get('/', validator_1.default, categoryController.search);
    return categoryRouter;
}
exports.default = default_1;
//# sourceMappingURL=category.js.map