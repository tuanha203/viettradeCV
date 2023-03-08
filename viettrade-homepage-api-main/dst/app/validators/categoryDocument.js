"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const custom_1 = require("./custom");
const b = custom_1.body;
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.create = [
    ...upsert,
    b('category_id', 'category_id'),
    b('title_vi', 'title_vi', [custom_1.V.required]),
    b('title_en', 'title_en')
];
//# sourceMappingURL=categoryDocument.js.map