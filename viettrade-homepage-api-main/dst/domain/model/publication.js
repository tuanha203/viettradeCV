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
exports.Publication = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Publication extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.Publication = Publication;
exports.default = (sequelize, dt) => {
    Publication.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, title_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, description_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, content_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            type: dt.TEXT()
        }, description_en: {
            type: dt.TEXT()
        }, content_en: {
            type: dt.TEXT()
        }, feature_image: {
            type: dt.TEXT()
        }, pdf_file: {
            type: dt.TEXT()
        }, display: {
            type: dt.INTEGER
        } }, (0, _common_1.commonFields)(dt)), {
        hooks: {
            beforeCreate: (publication) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE publications SET display = display + 1;`)
                    .then(() => {
                    publication.display = 1;
                });
            }),
            afterUpdate: (publication) => __awaiter(void 0, void 0, void 0, function* () {
                if (publication.dataValues.display !==
                    publication._previousDataValues.display) {
                    if (publication._previousDataValues.display <
                        publication.dataValues.display) {
                        sequelize.query(`UPDATE publications SET display = display - 1 WHERE display <= ${publication.dataValues.display} AND display > ${publication._previousDataValues.display} AND NOT id = ${publication.dataValues.id}`);
                    }
                    else {
                        sequelize.query(`UPDATE publications SET display = display + 1 WHERE display >= ${publication.dataValues.display} AND display < ${publication._previousDataValues.display} AND NOT id = ${publication.dataValues.id}`);
                    }
                }
            }),
            beforeDestroy: (publication) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE publications SET display = display - 1 WHERE display > ${publication.display}`)
                    .then();
            })
        },
        sequelize,
        tableName: 'publications'
    });
    return Publication;
};
//# sourceMappingURL=publication.js.map