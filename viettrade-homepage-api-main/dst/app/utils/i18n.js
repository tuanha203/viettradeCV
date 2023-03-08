"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const i18n = require('i18n');
const path = require("path");
i18n.configure({
    locales: ['en', 'vi'],
    directory: path.join(__dirname, '..', '..', '..', 'lang'),
    defaultLocale: 'vi'
});
exports.default = i18n;
//# sourceMappingURL=i18n.js.map