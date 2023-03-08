"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'question_vi',
        'answer_vi',
        'question_en',
        'answern_en',
        'display'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'question_vi',
        'answer_vi',
        'question_en',
        'answern_en',
        'display'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'question_vi',
        'answer_vi',
        'question_en',
        'answern_en',
        'display',
        'sort',
        'search'
    ]);
};
exports.searchData = searchData;
//# sourceMappingURL=question.js.map