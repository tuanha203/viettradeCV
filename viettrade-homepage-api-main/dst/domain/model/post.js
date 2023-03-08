"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
const category_1 = require("./category");
class Post extends Sequelize.Model {
    static ASSOCIATE() {
        Post.belongsTo(category_1.Category, { foreignKey: 'category_id' });
    }
}
exports.Post = Post;
exports.default = (sequelize, dt) => {
    Post.init(Object.assign({ id: {
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
        }, content_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, description_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            type: dt.TEXT()
        }, content_en: {
            type: dt.TEXT()
        }, description_en: {
            allowNull: false,
            type: dt.TEXT()
        }, feature_image: {
            type: dt.TEXT()
        }, feature_document: {
            type: dt.TEXT()
        }, view_count: {
            type: dt.INTEGER
        }, publish: {
            type: dt.TINYINT.UNSIGNED
        }, status: {
            type: dt.TINYINT.UNSIGNED
        }, publish_at: {
            type: dt.DATE
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'posts'
    });
    return Post;
};
//# sourceMappingURL=post.js.map