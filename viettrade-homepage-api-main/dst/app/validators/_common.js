"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonSearch = void 0;
const custom_1 = require("./custom");
const optional = (check, _) => check.optional({ checkFalsy: true });
exports.commonSearch = [
    (0, custom_1.query)('limit', 'Limit', [optional, custom_1.V.isDigits, custom_1.V.isUnsigned]),
    (0, custom_1.query)('offset', 'Page', [optional, custom_1.V.isDigits, custom_1.V.isUnsigned])
];
//# sourceMappingURL=_common.js.map