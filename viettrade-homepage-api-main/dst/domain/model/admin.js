"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Admin extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.Admin = Admin;
exports.default = (sequelize, dt) => {
    Admin.init(Object.assign({ id: {
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
        }, feature_image: {
            type: dt.STRING,
            allowNull: true
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'admin',
        name: { singular: 'admin', plural: 'admin' }
    });
    return Admin;
};
//# sourceMappingURL=admin.js.map