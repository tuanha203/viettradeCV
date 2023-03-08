"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateDisplayFormData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, ['title_vi', 'title_en']);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, ['title_vi', 'title_en']);
};
exports.updateFormData = updateFormData;
const updateDisplayFormData = (req) => {
    return (0, utils_1.pick)(req.body, ['display']);
};
exports.updateDisplayFormData = updateDisplayFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'title_vi',
        'title_en',
        'search'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=category.js.map