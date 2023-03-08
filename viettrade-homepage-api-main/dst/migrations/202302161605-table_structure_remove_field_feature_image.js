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
        return Promise.all([qi.removeColumn('structures', 'feature_image')]);
    }),
    down: (qi, dataTypes) => {
        return Promise.all([
            qi.addColumn('structures', 'feature_image', {
                type: dataTypes.STRING(255)
            })
        ]);
    }
};
//# sourceMappingURL=202302161605-table_structure_remove_field_feature_image.js.map