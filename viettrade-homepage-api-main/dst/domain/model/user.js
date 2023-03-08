"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class User extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.User = User;
exports.default = (sequelize, dt) => {
    User.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, role: {
            allowNull: false,
            type: dt.TINYINT.UNSIGNED
        }, name: {
            allowNull: false,
            type: dt.STRING(20)
        }, email: {
            allowNull: false,
            type: dt.STRING(50),
            unique: true
        }, password: {
            allowNull: false,
            type: dt.STRING(255)
        }, salt: {
            allowNull: false,
            type: dt.STRING(10)
        }, status: {
            allowNull: false,
            type: dt.TINYINT.UNSIGNED
        }, emailConfirmedAt: {
            type: dt.DATE
        }, lastLoginAt: {
            type: dt.DATE
        }, resetToken: {
            type: dt.STRING()
        }, resetExpiration: {
            type: dt.NUMBER()
        }, phone: {
            type: dt.STRING
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'user',
        name: { singular: 'user', plural: 'user' }
    });
    return User;
};
//# sourceMappingURL=user.js.map