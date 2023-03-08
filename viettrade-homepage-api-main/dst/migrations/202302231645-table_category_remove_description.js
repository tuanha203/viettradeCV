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
    up: (qi) => __awaiter(void 0, void 0, void 0, function* () {
        return Promise.all([
            qi.removeColumn('categories', 'description_vi'),
            qi.removeColumn('categories', 'description_en')
        ]);
    }),
    down: (qi, dataTypes) => {
        return Promise.all([
            qi.addColumn('categories', 'description_vi', {
                type: dataTypes.TEXT()
            }),
            qi.addColumn('categories', 'description_en', {
                type: dataTypes.TEXT()
            })
        ]);
    }
};
//# sourceMappingURL=202302231645-table_category_remove_description.js.map