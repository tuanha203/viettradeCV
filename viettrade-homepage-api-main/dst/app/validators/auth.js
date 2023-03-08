"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = void 0;
const custom_1 = require("./custom");
exports.login = [
    (0, custom_1.body)('*', [custom_1.S.emptyStringAsNull]),
    (0, custom_1.body)('email', 'email', [custom_1.V.required, custom_1.V.isValidEmail]),
    (0, custom_1.body)('password', 'password', [custom_1.V.required, custom_1.V.maxLength(255), custom_1.V.minLength(8)])
];
exports.refreshToken = [
    (0, custom_1.body)('*', [custom_1.S.emptyStringAsNull]),
    (0, custom_1.body)('refreshToken', 'refreshToken', [custom_1.V.required])
];
exports.logout = exports.refreshToken;
//# sourceMappingURL=auth.js.map