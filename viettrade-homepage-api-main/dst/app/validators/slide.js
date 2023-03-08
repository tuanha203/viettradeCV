"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDisplay = exports.create = exports.search = void 0;
const _common_1 = require("./_common");
const custom_1 = require("./custom");
const b = custom_1.body;
exports.search = [..._common_1.commonSearch];
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.create = [...upsert, b('title', 'title', [custom_1.V.required])];
exports.updateDisplay = [b('display', 'display', [custom_1.V.required])];
//# sourceMappingURL=slide.js.map