"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contact = exports.register = exports.create = exports.search = void 0;
const _common_1 = require("./_common");
const custom_1 = require("./custom");
const b = custom_1.body;
const q = custom_1.query;
const BC = custom_1.body;
exports.search = [q(['role'], [custom_1.S.multipleValueAsArray]), ..._common_1.commonSearch];
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.create = [
    ...upsert,
    b('name', 'name', [custom_1.V.required, custom_1.V.maxLength(191), custom_1.V.isValidNameVN]),
    b('email', 'email', [custom_1.V.required, custom_1.V.isValidEmail, custom_1.V.maxLength(50)]),
    b('password', 'password', [custom_1.V.required, custom_1.V.maxLength(20), custom_1.V.minLength(8)])
];
exports.register = [
    ...upsert,
    b('name', 'name', [custom_1.V.required, custom_1.V.maxLength(191), custom_1.V.isValidNameVN]),
    b('email', 'email', [custom_1.V.required, custom_1.V.isValidEmail, custom_1.V.maxLength(50)]),
    b('password', 'password', [custom_1.V.required, custom_1.V.maxLength(20), custom_1.V.minLength(8)])
];
exports.contact = [
    ...upsert,
    BC('fullName', 'fullName', [custom_1.V.required, custom_1.V.maxLength(50), custom_1.V.isValidNameVN]),
    BC('email', 'email', [custom_1.V.required, custom_1.V.isValidEmail, custom_1.V.maxLength(50)]),
    BC('phone', 'phone', [custom_1.V.maxLength(12)]),
    BC('title', 'title', [custom_1.V.required]),
    BC('content', 'content', [custom_1.V.required])
];
//# sourceMappingURL=user.js.map