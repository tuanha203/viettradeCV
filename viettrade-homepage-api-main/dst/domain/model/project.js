"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Project extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.Project = Project;
exports.default = (sequelize, dt) => {
    Project.init(Object.assign({ id: {
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
        }, description_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            type: dt.TEXT()
        }, description_en: {
            allowNull: false,
            type: dt.TEXT()
        }, content_en: {
            type: dt.TEXT()
        }, feature_image: {
            type: dt.STRING(255)
        }, feature_document: {
            type: dt.STRING(255)
        } }, (0, _common_1.commonFields)(dt)), {
        sequelize,
        tableName: 'projects'
    });
    return Project;
};
//# sourceMappingURL=project.js.map