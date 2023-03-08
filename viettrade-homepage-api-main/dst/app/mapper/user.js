"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFormData = exports.searchData = exports.updateFormData = exports.createFormData = void 0;
const utils_1 = require("../utils");
const createFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'role',
        'email',
        'name',
        'password',
        'status',
        'phone'
    ]);
};
exports.createFormData = createFormData;
const updateFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'role',
        'email',
        'name',
        'password',
        'status',
        'phone'
    ]);
};
exports.updateFormData = updateFormData;
const searchData = (req) => {
    return (0, utils_1.pickForSearch)(req.query, [
        'role',
        'email',
        'name',
        'type',
        'sort',
        'sortColumn',
        'search',
        'status',
        'phone'
    ]);
};
exports.searchData = searchData;
const registerFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'email',
        'name',
        'password',
        'phone'
    ]);
};
exports.registerFormData = registerFormData;
//# sourceMappingURL=user.js.map