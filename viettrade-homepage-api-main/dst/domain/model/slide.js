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
exports.Slide = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Slide extends Sequelize.Model {
    static ASSOCIATE() { }
}
exports.Slide = Slide;
exports.default = (sequelize, dt) => {
    Slide.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, title: {
            allowNull: false,
            type: dt.TEXT()
        }, link: {
            allowNull: false,
            type: dt.TEXT()
        }, display: {
            type: dt.INTEGER
        }, feature_image: {
            type: dt.TEXT()
        } }, (0, _common_1.commonFields)(dt)), {
        hooks: {
            beforeCreate: (slide) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE slides SET display = display + 1;`)
                    .then(() => {
                    slide.display = 1;
                });
            }),
            beforeDestroy: (slide) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`UPDATE slides SET display = display - 1 WHERE display > ` +
                    `${slide.display}` +
                    `;`)
                    .then(() => { });
            })
        },
        sequelize,
        tableName: 'slides'
    });
    return Slide;
};
//# sourceMappingURL=slide.js.map