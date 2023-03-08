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
exports.Company = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Company extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.Company = Company;
exports.default = (sequelize, dt) => {
    Company.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, name_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, description_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, name_en: {
            type: dt.TEXT()
        }, description_en: {
            type: dt.TEXT()
        }, feature_image: {
            type: dt.STRING(100)
        }, link: {
            type: dt.STRING(255)
        }, display: {
            allowNull: false,
            type: dt.INTEGER()
        }, connective: {
            type: dt.INTEGER()
        }, phone: {
            type: dt.STRING(255)
        }, address: {
            type: dt.STRING(255)
        }, status: {
            type: dt.TINYINT.UNSIGNED
        } }, (0, _common_1.commonFields)(dt)), {
        hooks: {
            beforeCreate: (company) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE companies SET display = display + 1;`)
                    .then(() => {
                    company.display = 1;
                });
            }),
            afterUpdate: (company) => __awaiter(void 0, void 0, void 0, function* () {
                if (company.dataValues.display !== company._previousDataValues.display) {
                    if (company._previousDataValues.display < company.dataValues.display) {
                        sequelize.query(`UPDATE companies SET display = display - 1 WHERE display <= ${company.dataValues.display} AND display > ${company._previousDataValues.display} AND NOT id = ${company.dataValues.id}`);
                    }
                    else {
                        sequelize.query(`UPDATE companies SET display = display + 1 WHERE display >= ${company.dataValues.display} AND display < ${company._previousDataValues.display} AND NOT id = ${company.dataValues.id}`);
                    }
                }
            }),
            beforeDestroy: (company) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE companies SET display = display - 1 WHERE display > ${company.display}`)
                    .then();
            })
        },
        sequelize,
        tableName: 'companies'
    });
    return Company;
};
//# sourceMappingURL=company.js.map