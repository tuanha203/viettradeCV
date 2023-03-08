"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
const categoryDocument_1 = require("./categoryDocument");
class Document extends Sequelize.Model {
    static ASSOCIATE() {
        Document.belongsTo(categoryDocument_1.CategoryDocument, { foreignKey: 'category_id' });
    }
}
exports.Document = Document;
exports.default = (sequelize, dt) => {
    Document.init(Object.assign({ id: {
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
        }, description_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            type: dt.TEXT()
        }, description_en: {
            allowNull: false,
            type: dt.TEXT()
        }, feature_document: {
            type: dt.TEXT()
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'documents'
    });
    return Document;
};
//# sourceMappingURL=document.js.map