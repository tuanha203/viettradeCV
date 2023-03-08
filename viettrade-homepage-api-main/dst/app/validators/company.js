"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = exports.search = void 0;
const _common_1 = require("./_common");
const custom_1 = require("./custom");
const b = custom_1.body;
exports.search = [..._common_1.commonSearch];
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.create = [
    ...upsert,
    b('name_vi', 'name_vi', [custom_1.V.required]),
    b('description_vi', 'description_vi', [custom_1.V.required]),
    b('name_en', 'name_en'),
    b('description_en', 'description_en'),
    b('link', 'link')
];
//# sourceMappingURL=company.js.map