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
            qi.addColumn('galleries', 'description_vi', {
                type: dataTypes.TEXT(),
                allowNull: true
            }),
            qi.addColumn('galleries', 'description_en', {
                type: dataTypes.TEXT(),
                allowNull: true
            }),
            qi.addColumn('publications', 'description_vi', {
                type: dataTypes.TEXT(),
                allowNull: true
            }),
            qi.addColumn('publications', 'description_en', {
                type: dataTypes.TEXT(),
                allowNull: true
            })
        ]);
    }),
    down: (qi) => {
        return Promise.all([
            qi.removeColumn('galleries', 'description_vi'),
            qi.removeColumn('galleries', 'description_en'),
            qi.removeColumn('publications', 'description_vi'),
            qi.removeColumn('publications', 'description_en')
        ]);
    }
};
//# sourceMappingURL=202212250911-table_galleries_publication_add_new_fields.js.map