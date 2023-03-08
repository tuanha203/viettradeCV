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
exports.Menu = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Menu extends Sequelize.Model {
    static ASSOCIATE() {
        Menu.belongsTo(Menu, {
            as: 'parent',
            foreignKey: 'parent_id'
        });
        Menu.hasMany(Menu, { foreignKey: 'parent_id' });
    }
}
exports.Menu = Menu;
exports.default = (sequelize, dt) => {
    Menu.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, title_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, title_en: {
            allowNull: true,
            type: dt.TEXT()
        }, link: {
            allowNull: true,
            type: dt.TEXT()
        }, display: {
            type: dt.INTEGER
        }, parent_id: {
            allowNull: true,
            type: dt.BIGINT.UNSIGNED
        } }, (0, _common_1.commonFields)(dt)), {
        hooks: {
            beforeCreate: (menu) => __awaiter(void 0, void 0, void 0, function* () {
                if (menu.parent_id != 0) {
                    return sequelize
                        .query(`UPDATE menus SET display = display + 1 WHERE parent_id = ` +
                        `${menu.parent_id}` +
                        `;`)
                        .then(() => {
                        menu.display = 1;
                    });
                }
                else {
                    return sequelize
                        .query(`UPDATE menus SET display = display + 1 WHERE parent_id = 0;`)
                        .then(() => {
                        menu.display = 1;
                    });
                }
            }),
            beforeUpdate: (menu) => __awaiter(void 0, void 0, void 0, function* () {
                if (menu.dataValues.parent_id !== menu._previousDataValues.parent_id &&
                    menu.dataValues.display === menu._previousDataValues.display) {
                    sequelize
                        .query(`UPDATE menus SET display = display + 1 WHERE parent_id = ${menu.dataValues.parent_id} AND NOT id = ${menu.dataValues.id};`)
                        .then(() => {
                        menu.display = 1;
                    });
                }
            }),
            afterUpdate: (menu) => __awaiter(void 0, void 0, void 0, function* () {
                if (menu.dataValues.parent_id !== menu._previousDataValues.parent_id &&
                    menu.dataValues.display === menu._previousDataValues.display) {
                    sequelize.query(`UPDATE menus SET display = display - 1 WHERE parent_id = ${menu._previousDataValues.parent_id} AND display > ${menu._previousDataValues.display}`);
                }
            }),
            beforeDestroy: (menu) => __awaiter(void 0, void 0, void 0, function* () {
                if (menu.parent_id != 0) {
                    return sequelize
                        .query(`UPDATE menus SET display = display - 1 WHERE display > ` +
                        `${menu.display}` +
                        ` AND parent_id = ` +
                        `${menu.parent_id}` +
                        `;`)
                        .then(() => { });
                }
                else {
                    return sequelize
                        .query(`UPDATE menus SET display = display - 1 WHERE parent_id = 0`)
                        .then(() => { });
                }
            }),
            afterDestroy: (menu) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`DELETE FROM menus WHERE parent_id = ` + `${menu.id}` + `;`)
                    .then(() => { });
            })
        },
        sequelize,
        tableName: 'menus'
    });
    return Menu;
};
//# sourceMappingURL=menu.js.map