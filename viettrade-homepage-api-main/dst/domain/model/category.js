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
exports.Category = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
const post_1 = require("./post");
class Category extends Sequelize.Model {
    static ASSOCIATE() {
        Category.hasMany(post_1.Post, { foreignKey: 'category_id' });
    }
}
exports.Category = Category;
exports.default = (sequelize, dt) => {
    Category.init(Object.assign({ id: {
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
            type: dt.TEXT()
        }, display: {
            type: dt.INTEGER()
        } }, (0, _common_1.commonFields)(dt)), {
        hooks: {
            beforeCreate: (category) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE categories SET display = display + 1;`)
                    .then(() => {
                    category.display = 1;
                });
            }),
            afterUpdate: (category) => __awaiter(void 0, void 0, void 0, function* () {
                if (category.dataValues.display !== category._previousDataValues.display) {
                    if (category._previousDataValues.display < category.dataValues.display) {
                        sequelize.query(`UPDATE categories SET display = display - 1 WHERE display <= ${category.dataValues.display} AND display > ${category._previousDataValues.display} AND NOT id = ${category.dataValues.id}`);
                    }
                    else {
                        sequelize.query(`UPDATE categories SET display = display + 1 WHERE display >= ${category.dataValues.display} AND display < ${category._previousDataValues.display} AND NOT id = ${category.dataValues.id}`);
                    }
                }
            }),
            beforeDestroy: (category) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE categories SET display = display - 1 WHERE display > ${category.display}`)
                    .then();
            })
        },
        sequelize,
        tableName: 'categories'
    });
    return Category;
};
//# sourceMappingURL=category.js.map