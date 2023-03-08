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
            qi.addColumn('departments', 'phone', {
                type: dataTypes.STRING()
            }),
            qi.addColumn('departments', 'email', {
                type: dataTypes.STRING()
            })
        ]);
    }),
    down: (qi) => {
        return Promise.all([
            qi.removeColumn('departments', 'phone'),
            qi.removeColumn('departments', 'email')
        ]);
    }
};
//# sourceMappingURL=202302011319-table-department-add-column-phone-email.js.map