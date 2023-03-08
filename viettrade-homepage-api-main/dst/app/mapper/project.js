"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'title_vi',
        'content_vi',
        'description_vi',
        'title_en',
        'content_en',
        'description_en'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'title_vi',
        'content_vi',
        'description_vi',
        'title_en',
        'content_en',
        'description_en'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'title_vi',
        'content_vi',
        'title_en',
        'content_en',
        'search',
        'sortColumn',
        'sort',
        'role'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=project.js.map