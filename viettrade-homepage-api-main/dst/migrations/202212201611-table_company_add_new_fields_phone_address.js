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
            qi.addColumn('companies', 'phone', {
                type: dataTypes.STRING(255),
                allowNull: false
            }),
            qi.addColumn('companies', 'address', {
                type: dataTypes.STRING(255),
                allowNull: false
            })
        ]);
    }),
    down: (qi) => {
        return Promise.all([
            qi.removeColumn('companies', 'phone'),
            qi.removeColumn('companies', 'address')
        ]);
    }
};
//# sourceMappingURL=202212201611-table_company_add_new_fields_phone_address.js.map