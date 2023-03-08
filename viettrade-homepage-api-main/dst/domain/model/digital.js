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
exports.Digital = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Digital extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.Digital = Digital;
exports.default = (sequelize, dt) => {
    Digital.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, title_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            type: dt.TEXT()
        }, feature_image: {
            type: dt.STRING(255)
        }, feature_icon: {
            type: dt.STRING(255)
        }, link: {
            type: dt.STRING(255)
        }, display: {
            allowNull: false,
            type: dt.INTEGER()
        } }, (0, _common_1.commonFields)(dt)), {
        hooks: {
            beforeCreate: (question) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE digitals SET display = display + 1;`)
                    .then(() => {
                    question.display = 1;
                });
            }),
            afterUpdate: (question) => __awaiter(void 0, void 0, void 0, function* () {
                if (question.dataValues.display !== question._previousDataValues.display) {
                    if (question._previousDataValues.display < question.dataValues.display) {
                        sequelize.query(`UPDATE digitals SET display = display - 1 WHERE display <= ${question.dataValues.display} AND display > ${question._previousDataValues.display} AND NOT id = ${question.dataValues.id}`);
                    }
                    else {
                        sequelize.query(`UPDATE digitals SET display = display + 1 WHERE display >= ${question.dataValues.display} AND display < ${question._previousDataValues.display} AND NOT id = ${question.dataValues.id}`);
                    }
                }
            }),
            beforeDestroy: (question) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE digitals SET display = display - 1 WHERE display > ${question.display}`)
                    .then();
            })
        },
        sequelize,
        tableName: 'digitals'
    });
    return Digital;
};
//# sourceMappingURL=digital.js.map