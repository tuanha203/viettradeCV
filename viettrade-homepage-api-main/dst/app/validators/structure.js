"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.search = void 0;
const _common_1 = require("./_common");
const custom_1 = require("./custom");
const b = custom_1.body;
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.search = [..._common_1.commonSearch];
exports.create = [
    ...upsert,
    b('full_name_vi', 'full_name_vi', [custom_1.V.required])
];
//# sourceMappingURL=structure.js.map