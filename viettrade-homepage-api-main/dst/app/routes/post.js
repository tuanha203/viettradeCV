"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const post_1 = require("../controllers/post");
const routeGuard_1 = require("../middlewares/routeGuard");
const validator_1 = require("../middlewares/validator");
const postValidator = require("../validators/post");
const multer = require("multer");
const utils_1 = require("../utils");
function default_1(db) {
    const postRouter = (0, express_1.Router)();
    const postController = new post_1.default(db);
    const storage = multer.diskStorage({
        destination: './public/files',
        filename: utils_1.editFileName
    });
    const upload = multer({ storage });
    /**
     * postCreate API
     */
    postRouter.post('/', upload.fields([
        {
            name: 'feature_image'
        },
        {
            name: 'feature_document'
        }
    ]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.postCreate), postValidator.create, validator_1.default, postController.create);
    postRouter.post('/upload', upload.single('file'), postController.uploadFile);
    /**
     * postCountView API
     */
    postRouter.post('/count-view/:id', validator_1.default, postController.countView);
    /**
     * postUpdate API
     */
    postRouter.put('/:id', upload.fields([
        {
            name: 'feature_image'
        },
        {
            name: 'feature_document'
        }
    ]), (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.postUpdate), validator_1.default, postController.update);
    /**
     * postSearch API
     */
    postRouter.get('/', postValidator.search, validator_1.default, postController.search);
    /**
     * postSearchId API
     */
    postRouter.get('/:id([0-9]+)', postController.searchId);
    /**
     * postDelete API
     */
    postRouter.delete('/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.postDelete), postController.delete);
    postRouter.put('/approve/:id([0-9]+)', (0, routeGuard_1.routeGuard)(routeGuard_1.apiList.postUpdate), postController.approve);
    return postRouter;
}
exports.default = default_1;
//# sourceMappingURL=post.js.map