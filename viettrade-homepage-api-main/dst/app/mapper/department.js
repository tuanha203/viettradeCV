"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'parent_id',
        'full_name',
        'position_vi',
        'phone',
        'email',
        'position_en',
        'feature_image'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'parent_id',
        'full_name',
        'position_vi',
        'position_en',
        'phone',
        'email',
        'feature_image'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'parent_id',
        'full_name',
        'position_vi',
        'position_en',
        'phone',
        'email',
        'sort',
        'search'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=department.js.map