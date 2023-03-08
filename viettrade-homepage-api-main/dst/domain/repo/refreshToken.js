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
const moment = require("moment");
const sequelize_1 = require("sequelize");
const uuid = require("uuid");
const _base_1 = require("./_base");
class RefreshTokenRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.RefreshToken;
    }
    create(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = uuid.v4();
            yield this.model.create({
                userId,
                refreshToken,
                expireAt: moment().add(30, 'days')
            });
            this.deleteToken();
            return refreshToken;
        });
    }
    checkRefreshToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshTokens = yield this.model.findAll({
                where: {
                    refreshToken: token,
                    expireAt: {
                        [sequelize_1.Op.gt]: new Date()
                    }
                }
            });
            if (refreshTokens.length === 0) {
                return undefined;
            }
            return refreshTokens[0];
        });
    }
    deleteToken() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    expireAt: {
                        [sequelize_1.Op.lt]: new Date()
                    }
                }
            });
        });
    }
}
exports.default = RefreshTokenRepository;
//# sourceMappingURL=refreshToken.js.map