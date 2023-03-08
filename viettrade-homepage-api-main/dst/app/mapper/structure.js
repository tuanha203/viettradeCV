"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateDisplayFormData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'parent_id',
        'full_name_vi',
        'full_name_en',
        'position_vi',
        'position_en',
        'phone',
        'email',
        'fax',
        'website',
        'level',
        'address'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'parent_id',
        'full_name_vi',
        'full_name_en',
        'position_vi',
        'position_en',
        'phone',
        'email',
        'fax',
        'website',
        'level',
        'address'
    ]);
};
exports.updateFormData = updateFormData;
const updateDisplayFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'source',
        'display_source',
        'destination',
        'display_destination'
    ]);
};
exports.updateDisplayFormData = updateDisplayFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'parent_id',
        'full_name_vi',
        'full_name_en',
        'position_vi',
        'position_en',
        'phone',
        'email',
        'sort',
        'fax',
        'website',
        'search',
        'address'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=structure.js.map