"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'category_id',
        'title_vi',
        'content_vi',
        'description_vi',
        'title_en',
        'content_en',
        'description_en',
        'publish'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'category_id',
        'title_vi',
        'content_vi',
        'description_vi',
        'title_en',
        'content_en',
        'description_en',
        'publish',
        'status'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'category_id',
        'title_vi',
        'content_vi',
        'title_en',
        'content_en',
        'search',
        'sortColumn',
        'sort',
        'publish',
        'role'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=post.js.map