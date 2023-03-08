"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateDisplayFormData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'title_vi',
        'title_en',
        'link',
        'display',
        'parent_id'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'title_vi',
        'title_en',
        'link',
        'display',
        'parent_id'
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
        'title_vi',
        'title_en',
        'link',
        'search'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=menu.js.map