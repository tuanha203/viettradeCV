"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const admin_1 = require("./admin");
const auth_1 = require("./auth");
const category_1 = require("./category");
const categoryDocument_1 = require("./categoryDocument");
const company_1 = require("./company");
const department_1 = require("./department");
const digital_1 = require("./digital");
const document_1 = require("./document");
const gallery_1 = require("./gallery");
const menu_1 = require("./menu");
const post_1 = require("./post");
const project_1 = require("./project");
const publication_1 = require("./publication");
const question_1 = require("./question");
const slide_1 = require("./slide");
const structure_1 = require("./structure");
const user_1 = require("./user");
function default_1(db) {
    const router = express.Router();
    router.use('/auth', (0, auth_1.default)(db));
    router.use('/user', (0, user_1.default)(db));
    router.use('/admin', (0, admin_1.default)(db));
    router.use('/category', (0, category_1.default)(db));
    router.use('/category-document', (0, categoryDocument_1.default)(db));
    router.use('/company', (0, company_1.default)(db));
    router.use('/post', (0, post_1.default)(db));
    router.use('/slide', (0, slide_1.default)(db));
    router.use('/department', (0, department_1.default)(db));
    router.use('/document', (0, document_1.default)(db));
    router.use('/gallery', (0, gallery_1.default)(db));
    router.use('/publication', (0, publication_1.default)(db));
    router.use('/question', (0, question_1.default)(db));
    router.use('/structure', (0, structure_1.default)(db));
    router.use('/menu', (0, menu_1.default)(db));
    router.use('/digital', (0, digital_1.default)(db));
    router.use('/project', (0, project_1.default)(db));
    return router;
}
exports.default = default_1;
//# sourceMappingURL=index.js.map