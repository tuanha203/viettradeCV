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
const crypto = require("crypto");
function hashPassword(password) {
    const randomSalt = Math.random()
        .toString(36)
        .substring(2)
        .substring(0, 10);
    const hashedPassword = crypto
        .createHmac('sha256', randomSalt)
        .update(password)
        .digest('hex');
    return {
        salt: randomSalt,
        password: hashedPassword
    };
}
exports.default = {
    up: (qi) => __awaiter(void 0, void 0, void 0, function* () {
        yield qi.bulkDelete('admin', {}, {});
        yield qi.bulkInsert('admin', [
            Object.assign(Object.assign({}, hashPassword('12345678')), { role: 0, name: 'Admin', email: 'admin@gmail.com', status: 1, createdAt: new Date(), updatedAt: new Date() })
        ], {});
    })
};
//# sourceMappingURL=202212151015-seed-admin.js.map