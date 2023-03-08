"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const company_1 = require("../controllers/company");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const companyValidator = require("../validators/company");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const companyRouter = (0, express_1.Router)();
    const companyController = new company_1.default(db);
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
     * postCreate API
     */
    companyRouter.post('/', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.companyCreate), companyValidator.create, validator_1.default, companyController.create);
    /**
     * companyUpdate API
     */
    companyRouter.put('/:id', upload.single('feature_image'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.companyUpdate), validator_1.default, companyController.update);
    /**
     * companyUpdate API
     */
    companyRouter.put('/display/:id', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.companyUpdate), validator_1.default, companyController.updateDisplay);
    /**
     * companySearch API
     */
    companyRouter.get('/', companyValidator.search, validator_1.default, companyController.search);
    /**
     * companySearch API
     */
    companyRouter.get('/all', companyValidator.search, validator_1.default, companyController.searchAll);
    /**
     * companySearchId API
     */
    companyRouter.get('/:id([0-9]+)', validator_1.default, companyController.searchId);
    /**
     * companyDelete API
     */
    companyRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.companyDelete), companyController.delete);
    companyRouter.put('/approve/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.companyUpdate), companyController.approve);
    return companyRouter;
}
exports.default = default_1;
//# sourceMappingURL=company.js.map