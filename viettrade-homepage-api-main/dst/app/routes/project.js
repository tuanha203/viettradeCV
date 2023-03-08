"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_1 = require("../controllers/project");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const projectValidator = require("../validators/project");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const projectRouter = (0, express_1.Router)();
    const projectController = new project_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    /**
     * projectCreate API
     */
    projectRouter.post('/', upload.fields([
        {
            name: 'feature_image'
        },
        {
            name: 'feature_document'
        }
    ]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.projectCreate), projectValidator.create, validator_1.default, projectController.create);
    projectRouter.post('/upload', upload.single('file'), projectController.uploadFile);
    /**
     * projectUpdate API
     */
    projectRouter.put('/:id', upload.fields([
        {
            name: 'feature_image'
        },
        {
            name: 'feature_document'
        }
    ]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.projectUpdate), validator_1.default, projectController.update);
    /**
     * projectSearch API
     */
    projectRouter.get('/', projectValidator.search, validator_1.default, projectController.search);
    /**
     * projectSearchId API
     */
    projectRouter.get('/:id([0-9]+)', projectController.searchId);
    /**
     * projectDelete API
     */
    projectRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.projectDelete), projectController.delete);
    return projectRouter;
}
exports.default = default_1;
//# sourceMappingURL=project.js.map