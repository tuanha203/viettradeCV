"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.digital = exports.menu = exports.document = exports.categoryDocument = exports.department = exports.structure = exports.question = exports.publication = exports.gallery = exports.slide = exports.company = exports.project = exports.post = exports.category = exports.auth = exports.admin = exports.user = void 0;
const adminFactory = require("./factory/admin");
const companyFactory = require("./factory/company");
const postFactory = require("./factory/post");
const userFactory = require("./factory/user");
var user;
(function (user) {
    user.Role = userFactory.Role;
    user.Status = userFactory.Status;
})(user = exports.user || (exports.user = {}));
var admin;
(function (admin) {
    admin.Role = adminFactory.Role;
    admin.Status = adminFactory.Status;
})(admin = exports.admin || (exports.admin = {}));
var auth;
(function (auth) {
})(auth = exports.auth || (exports.auth = {}));
var category;
(function (category) {
})(category = exports.category || (exports.category = {}));
var post;
(function (post) {
    post.Publish = postFactory.Publish;
})(post = exports.post || (exports.post = {}));
var project;
(function (project) {
})(project = exports.project || (exports.project = {}));
var company;
(function (company) {
    company.Connective = companyFactory.Connective;
    company.Status = companyFactory.Status;
})(company = exports.company || (exports.company = {}));
var slide;
(function (slide) {
})(slide = exports.slide || (exports.slide = {}));
var gallery;
(function (gallery) {
})(gallery = exports.gallery || (exports.gallery = {}));
var publication;
(function (publication) {
})(publication = exports.publication || (exports.publication = {}));
var question;
(function (question) {
})(question = exports.question || (exports.question = {}));
var structure;
(function (structure) {
})(structure = exports.structure || (exports.structure = {}));
var department;
(function (department) {
})(department = exports.department || (exports.department = {}));
var categoryDocument;
(function (categoryDocument) {
})(categoryDocument = exports.categoryDocument || (exports.categoryDocument = {}));
var document;
(function (document) {
})(document = exports.document || (exports.document = {}));
var menu;
(function (menu) {
})(menu = exports.menu || (exports.menu = {}));
var digital;
(function (digital) {
})(digital = exports.digital || (exports.digital = {}));
var refreshToken;
(function (refreshToken) {
})(refreshToken = exports.refreshToken || (exports.refreshToken = {}));
//# sourceMappingURL=types.js.map