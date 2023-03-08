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
            qi.renameColumn('structures', 'full_name', 'full_name_vi'),
            qi.addColumn('structures', 'full_name_en', {
                type: dataTypes.STRING()
            })
        ]);
    }),
    down: (qi) => {
        return Promise.all([
            qi.renameColumn('structures', 'full_name_vi', 'full_name'),
            qi.removeColumn('structures', 'full_name_en')
        ]);
    }
};
//# sourceMappingURL=202302151500-table_structure_add_new_field_full_name_en.js.map