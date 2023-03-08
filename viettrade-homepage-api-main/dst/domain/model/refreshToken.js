"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class RefreshToken extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.RefreshToken = RefreshToken;
exports.default = (sequelize, dt) => {
    RefreshToken.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, userId: {
            allowNull: false,
            type: dt.BIGINT.UNSIGNED
        }, refreshToken: {
            allowNull: false,
            type: dt.STRING(255)
        }, expireAt: {
            allowNull: false,
            type: dt.DATE
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'refreshTokens'
    });
    return RefreshToken;
};
//# sourceMappingURL=refreshToken.js.map