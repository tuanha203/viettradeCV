"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    up: (qi, dataTypes) => __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all([
            qi.removeColumn('slides', 'title_vi'),
            qi.removeColumn('slides', 'title_en'),
            qi.addColumn('slides', 'title', {
                allowNull: false,
                type: dataTypes.TEXT()
            })
        ]);
    }),
    down: (qi, dataTypes) => {
        return Promise.all([
            qi.addColumn('slides', 'title_vi', {
                allowNull: false,
                type: dataTypes.TEXT()
            }),
            qi.addColumn('slides', 'title_en', {
                allowNull: false,
                type: dataTypes.TEXT()
            }),
            qi.removeColumn('slides', 'title')
        ]);
    }
};
//# sourceMappingURL=202212291538-table_slide_replace_fields_title_vi_title_en_to_title.js.map