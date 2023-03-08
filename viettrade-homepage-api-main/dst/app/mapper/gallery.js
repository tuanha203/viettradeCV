"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'title_vi',
        'content_vi',
        'title_en',
        'content_en',
        'feature_video'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'title_vi',
        'content_vi',
        'title_en',
        'content_en',
        'feature_video'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'title_vi',
        'content_vi',
        'title_en',
        'content_en',
        'sort',
        'search'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=gallery.js.map