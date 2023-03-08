"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_1 = require("../controllers/document");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const documentValidator = require("../validators/document");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const documentRouter = (0, express_1.Router)();
    const documentController = new document_1.default(db);
    const today = new Date().toLocaleDateString('zh-Hans-CN');
    const storage = multer.diskStorage({
        destination: './public/files/documents/' + today,
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    /**
     * Document Create API
     */
    documentRouter.post('/', upload.single('feature_document'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.documentCreate), documentValidator.create, validator_1.default, documentController.create);
    /**
     * Document Update API
     */
    documentRouter.put('/:id', upload.single('feature_document'), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.documentUpdate), validator_1.default, documentController.update);
    documentRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.documentDelete), documentController.delete);
    /**
     * Document SearchId API
     */
    documentRouter.get('/:id([0-9]+)', documentController.searchId);
    /**
     * Document Search API
     */
    documentRouter.get('/', validator_1.default, documentController.search);
    return documentRouter;
}
exports.default = default_1;
//# sourceMappingURL=document.js.map