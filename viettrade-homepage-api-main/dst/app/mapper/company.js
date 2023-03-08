"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'name_vi',
        'description_vi',
        'name_en',
        'description_en',
        'link',
        'display',
        'connective',
        'phone',
        'address'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'name_vi',
        'description_vi',
        'name_en',
        'description_en',
        'link',
        'display',
        'connective',
        'phone',
        'address'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'name_vi',
        'description_vi',
        'name_en',
        'description_en',
        'link',
        'connective',
        'search',
        'phone',
        'address',
        'sort',
        'sortColumn'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=company.js.map