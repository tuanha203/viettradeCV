"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = exports.Digital = exports.Menu = exports.Structure = exports.Publication = exports.Gallery = exports.Question = exports.Slide = exports.Document = exports.Department = exports.Company = exports.Project = exports.Post = exports.CategoryDocument = exports.Category = exports.Admin = exports.User = exports.Auth = void 0;
const admin_1 = require("./repo/admin");
const auth_1 = require("./repo/auth");
const category_1 = require("./repo/category");
const categoryDocument_1 = require("./repo/categoryDocument");
const company_1 = require("./repo/company");
const department_1 = require("./repo/department");
const digital_1 = require("./repo/digital");
const document_1 = require("./repo/document");
const gallery_1 = require("./repo/gallery");
const menu_1 = require("./repo/menu");
const post_1 = require("./repo/post");
const project_1 = require("./repo/project");
const publication_1 = require("./repo/publication");
const question_1 = require("./repo/question");
const refreshToken_1 = require("./repo/refreshToken");
const slide_1 = require("./repo/slide");
const structure_1 = require("./repo/structure");
const user_1 = require("./repo/user");
// tslint:disable max-classes-per-file
class Auth extends auth_1.default {
}
exports.Auth = Auth;
class User extends user_1.default {
}
exports.User = User;
class Admin extends admin_1.default {
}
exports.Admin = Admin;
class Category extends category_1.default {
}
exports.Category = Category;
class CategoryDocument extends categoryDocument_1.default {
}
exports.CategoryDocument = CategoryDocument;
class Post extends post_1.default {
}
exports.Post = Post;
class Project extends project_1.default {
}
exports.Project = Project;
class Company extends company_1.default {
}
exports.Company = Company;
class Department extends department_1.default {
}
exports.Department = Department;
class Document extends document_1.default {
}
exports.Document = Document;
class Slide extends slide_1.default {
}
exports.Slide = Slide;
class Question extends question_1.default {
}
exports.Question = Question;
class Gallery extends gallery_1.default {
}
exports.Gallery = Gallery;
class Publication extends publication_1.default {
}
exports.Publication = Publication;
class Structure extends structure_1.default {
}
exports.Structure = Structure;
class Menu extends menu_1.default {
}
exports.Menu = Menu;
class Digital extends digital_1.default {
}
exports.Digital = Digital;
class RefreshToken extends refreshToken_1.default {
}
exports.RefreshToken = RefreshToken;
//# sourceMappingURL=repository.js.map