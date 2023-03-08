"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.create = exports.search = void 0;
const _common_1 = require("./_common");
const custom_1 = require("./custom");
const b = custom_1.body;
exports.search = [..._common_1.commonSearch];
const upsert = [(0, custom_1.body)('*', [custom_1.S.emptyStringAsNull])];
exports.create = [
    ...upsert,
    b('question_vi', 'question_vi', [custom_1.V.required]),
    b('answer_vi', 'answer_vi', [custom_1.V.required]),
    b('question_en', 'question_en'),
    b('answern_en', 'answern_en'),
    b('display', 'display')
];
exports.update = [
    ...upsert,
    b('question_vi', 'question_vi'),
    b('answer_vi', 'answer_vi'),
    b('question_en', 'question_en'),
    b('answern_en', 'answern_en'),
    b('display', 'display')
];
//# sourceMappingURL=question.js.map