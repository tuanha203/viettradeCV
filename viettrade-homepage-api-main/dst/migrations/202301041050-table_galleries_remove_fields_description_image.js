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
            qi.removeColumn('galleries', 'description_vi'),
            qi.removeColumn('galleries', 'description_en'),
            qi.removeColumn('galleries', 'feature_image')
        ]);
    }),
    down: (qi, dataTypes) => {
        return Promise.all([
            qi.addColumn('galleries', 'description_vi', {
                allowNull: false,
                type: dataTypes.TEXT()
            }),
            qi.addColumn('galleries', 'description_en', {
                allowNull: false,
                type: dataTypes.TEXT()
            }),
            qi.addColumn('galleries', 'feature_image', {
                allowNull: false,
                type: dataTypes.STRING(255)
            })
        ]);
    }
};
//# sourceMappingURL=202301041050-table_galleries_remove_fields_description_image.js.map