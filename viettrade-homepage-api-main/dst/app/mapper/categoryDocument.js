"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'category_id',
        'title_vi',
        'title_en'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'category_id',
        'title_vi',
        'title_en'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'category_id',
        'title_vi',
        'title_en',
        'search',
        'sort',
        'sortColumn',
        'all_levels'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=categoryDocument.js.map