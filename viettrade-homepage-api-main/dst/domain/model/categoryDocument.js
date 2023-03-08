"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryDocument = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
const document_1 = require("./document");
class CategoryDocument extends Sequelize.Model {
    static ASSOCIATE() {
        CategoryDocument.hasMany(document_1.Document, { foreignKey: 'category_id' });
        CategoryDocument.belongsTo(CategoryDocument, {
            as: 'parent',
            foreignKey: 'category_id'
        });
        CategoryDocument.hasMany(CategoryDocument, {
            as: 'children',
            foreignKey: 'category_id'
        });
    }
}
exports.CategoryDocument = CategoryDocument;
exports.default = (sequelize, dt) => {
    CategoryDocument.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, category_id: {
            allowNull: false,
            type: dt.BIGINT.UNSIGNED
        }, title_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            type: dt.TEXT()
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'categories_documents'
    });
    return CategoryDocument;
};
//# sourceMappingURL=categoryDocument.js.map