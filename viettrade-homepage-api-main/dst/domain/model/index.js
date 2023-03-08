"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const lodash_1 = require("lodash");
const Sequelize = require("sequelize");
const admin_1 = require("./admin");
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
const refreshToken_1 = require("./refreshToken");
const slide_1 = require("./slide");
const structure_1 = require("./structure");
const user_1 = require("./user");
const initialize = (sqlize) => {
    const db = {
        User: sqlize.import(user_1.User.name, user_1.default),
        Admin: sqlize.import(admin_1.Admin.name, admin_1.default),
        CategoryDocument: sqlize.import(categoryDocument_1.CategoryDocument.name, categoryDocument_1.default),
        Category: sqlize.import(category_1.Category.name, category_1.default),
        Post: sqlize.import(post_1.Post.name, post_1.default),
        Project: sqlize.import(project_1.Project.name, project_1.default),
        Company: sqlize.import(company_1.Company.name, company_1.default),
        Department: sqlize.import(department_1.Department.name, department_1.default),
        Document: sqlize.import(document_1.Document.name, document_1.default),
        Slide: sqlize.import(slide_1.Slide.name, slide_1.default),
        Question: sqlize.import(question_1.Question.name, question_1.default),
        Gallery: sqlize.import(gallery_1.Gallery.name, gallery_1.default),
        Publication: sqlize.import(publication_1.Publication.name, publication_1.default),
        Structure: sqlize.import(structure_1.Structure.name, structure_1.default),
        Menu: sqlize.import(menu_1.Menu.name, menu_1.default),
        Digital: sqlize.import(digital_1.Digital.name, digital_1.default),
        RefreshToken: sqlize.import(refreshToken_1.RefreshToken.name, refreshToken_1.default)
    };
    // initialize all association of all model
    for (const model of (0, lodash_1.values)(db)) {
        if (typeof model.ASSOCIATE === 'function') {
            model.ASSOCIATE();
        }
    }
    return Object.assign(Object.assign({}, db), { sequelize: sqlize, Sequelize });
};
exports.initialize = initialize;
//# sourceMappingURL=index.js.map