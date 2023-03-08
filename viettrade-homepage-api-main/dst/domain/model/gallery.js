"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gallery = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Gallery extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.Gallery = Gallery;
exports.default = (sequelize, dt) => {
    Gallery.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, title_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, content_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            type: dt.TEXT()
        }, content_en: {
            type: dt.TEXT()
        }, feature_video: {
            type: dt.TEXT()
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'galleries'
    });
    return Gallery;
};
//# sourceMappingURL=gallery.js.map