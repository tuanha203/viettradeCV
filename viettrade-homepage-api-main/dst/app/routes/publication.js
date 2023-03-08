"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publication_1 = require("../controllers/publication");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const publicationValidator = require("../validators/publication");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const publicationRouter = (0, express_1.Router)();
    const publicationController = new publication_1.default(db);
    const today = new Date().toLocaleDateString('zh-Hans-CN');
    const storage = multer.diskStorage({
        destination: './public/files/publications/' + today,
        filename: utils_1.editFileName
    });
    const upload_image = multer({
        storage,
        fileFilter: (_req, file, cb) => {
            if (file.mimetype == 'image/png' ||
                file.mimetype == 'image/jpg' ||
                file.mimetype == 'image/jpeg' ||
                file.mimetype == 'application/pdf') {
                cb(null, true);
            }
            else {
                cb(null, false);
                return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
            }
        }
    });
    /**
     * publicationCreate API
     */
    publicationRouter.post('/', upload_image.fields([{ name: 'feature_image' }, { name: 'pdf_file' }]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.publicationCreate), publicationValidator.create, validator_1.default, publicationController.create);
    publicationRouter.post('/upload', upload_image.single('file'), (req, res, _next) => {
        var _a;
        res.json({ location: '/public/files/' + ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) });
    });
    /**
     * publicationUpdate API
     */
    publicationRouter.put('/:id([0-9]+)', upload_image.fields([{ name: 'feature_image' }, { name: 'pdf_file' }]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.publicationUpdate), publicationValidator.update, validator_1.default, publicationController.update);
    /**
     * publicationSearch API
     */
    publicationRouter.get('/', publicationValidator.search, validator_1.default, publicationController.search);
    /**
     * publicationSearchId API
     */
    publicationRouter.get('/:id([0-9]+)', publicationController.searchId);
    /**
     * publicationDelete API
     */
    publicationRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.publicationDelete), publicationController.delete);
    return publicationRouter;
}
exports.default = default_1;
//# sourceMappingURL=publication.js.map