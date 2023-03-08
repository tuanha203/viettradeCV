"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const custom_1 = require("./custom");
const b = custom_1.body;
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.create = [
    ...upsert,
    b('full_name', 'full_name', [custom_1.V.required]),
    b('position_vi', 'position_vi', [custom_1.V.required])
];
//# sourceMappingURL=department.js.map