"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Department = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Department extends Sequelize.Model {
    static ASSOCIATE() {
        Department.belongsTo(Department, {
            as: 'parent',
            foreignKey: 'parent_id'
        });
        Department.hasMany(Department, { foreignKey: 'parent_id' });
    }
}
exports.Department = Department;
exports.default = (sequelize, dt) => {
    Department.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, parent_id: {
            allowNull: true,
            type: dt.BIGINT.UNSIGNED
        }, full_name: {
            allowNull: false,
            type: dt.TEXT()
        }, position_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, position_en: {
            allowNull: true,
            type: dt.TEXT()
        }, phone: {
            allowNull: true,
            type: dt.TEXT()
        }, email: {
            allowNull: true,
            type: dt.TEXT()
        }, feature_image: {
            type: dt.TEXT()
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'departments'
    });
    return Department;
};
//# sourceMappingURL=department.js.map