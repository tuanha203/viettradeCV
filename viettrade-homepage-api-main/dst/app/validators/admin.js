"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.create = exports.search = void 0;
const _common_1 = require("./_common");
const custom_1 = require("./custom");
const b = custom_1.body;
const q = custom_1.query;
exports.search = [q(['role'], [custom_1.S.multipleValueAsArray]), ..._common_1.commonSearch];
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.create = [
    ...upsert,
    b('name', 'name', [custom_1.V.required, custom_1.V.maxLength(20), custom_1.V.isValidNameVN]),
    b('email', 'email', [custom_1.V.required, custom_1.V.isValidEmail, custom_1.V.maxLength(50)]),
    b('password', 'password', [custom_1.V.required, custom_1.V.maxLength(20), custom_1.V.minLength(8)])
];
exports.register = [
    ...upsert,
    b('name', 'name', [custom_1.V.required, custom_1.V.maxLength(20), custom_1.V.isValidNameVN]),
    b('email', 'email', [custom_1.V.required, custom_1.V.isValidEmail, custom_1.V.maxLength(50)]),
    b('password', 'password', [custom_1.V.required, custom_1.V.maxLength(20), custom_1.V.minLength(8)])
];
//# sourceMappingURL=admin.js.map