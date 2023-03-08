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
exports.Structure = void 0;
const Sequelize = require("sequelize");
const _common_1 = require("./_common");
class Structure extends Sequelize.Model {
    static ASSOCIATE() {
        Structure.belongsTo(Structure, {
            as: 'parent',
            foreignKey: 'parent_id'
        });
        Structure.hasMany(Structure, { foreignKey: 'parent_id' });
    }
}
exports.Structure = Structure;
exports.default = (sequelize, dt) => {
    Structure.init(Object.assign({ id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: dt.BIGINT.UNSIGNED
        }, parent_id: {
            allowNull: true,
            type: dt.BIGINT.UNSIGNED
        }, full_name_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, full_name_en: {
            allowNull: true,
            type: dt.TEXT()
        }, position_vi: {
            allowNull: false,
            type: dt.TEXT()
        }, position_en: {
            allowNull: true,
            type: dt.TEXT()
        }, phone: {
            allowNull: true,
            type: dt.TEXT()
        }, email: {
            allowNull: true,
            type: dt.TEXT()
        }, fax: {
            type: dt.TEXT()
        }, website: {
            type: dt.TEXT()
        }, level: {
            type: dt.INTEGER()
        }, display: {
            type: dt.INTEGER
        }, address: {
            type: dt.TEXT()
        } }, (0, _common_1.commonFields)(dt)), {
        hooks: {
            beforeCreate: (structure) => __awaiter(void 0, void 0, void 0, function* () {
                if (structure.parent_id != 0) {
                    return sequelize
                        .query(`UPDATE structures SET display = display + 1 WHERE parent_id = ` +
                        `${structure.parent_id}` +
                        `;`)
                        .then(() => {
                        structure.display = 1;
                    });
                }
                else {
                    return sequelize
                        .query(`UPDATE structures SET display = display + 1 WHERE parent_id = 0;`)
                        .then(() => {
                        structure.display = 1;
                    });
                }
            }),
            beforeUpdate: (structure) => __awaiter(void 0, void 0, void 0, function* () {
                if (structure.dataValues.parent_id !==
                    structure._previousDataValues.parent_id &&
                    structure.dataValues.display ===
                        structure._previousDataValues.display) {
                    sequelize
                        .query(`UPDATE structures SET display = display + 1 WHERE parent_id = ${structure.dataValues.parent_id} AND NOT id = ${structure.dataValues.id};`)
                        .then(() => {
                        structure.display = 1;
                    });
                }
            }),
            afterUpdate: (structure) => __awaiter(void 0, void 0, void 0, function* () {
                if (structure.dataValues.parent_id !==
                    structure._previousDataValues.parent_id &&
                    structure.dataValues.display ===
                        structure._previousDataValues.display) {
                    sequelize.query(`UPDATE structures SET display = display - 1 WHERE parent_id = ${structure._previousDataValues.parent_id} AND display > ${structure._previousDataValues.display}`);
                }
            }),
            beforeDestroy: (structure) => __awaiter(void 0, void 0, void 0, function* () {
                if (structure.parent_id != 0) {
                    return sequelize
                        .query(`UPDATE structures SET display = display - 1 WHERE display > ` +
                        `${structure.display}` +
                        ` AND parent_id = ` +
                        `${structure.parent_id}` +
                        `;`)
                        .then(() => { });
                }
                else {
                    return sequelize
                        .query(`UPDATE structures SET display = display - 1 WHERE parent_id = 0 AND display > ${structure.display}`)
                        .then(() => { });
                }
            }),
            afterDestroy: (structure) => __awaiter(void 0, void 0, void 0, function* () {
                return sequelize
                    .query(`DELETE FROM structures WHERE parent_id IN (SELECT id FROM (SELECT id FROM structures st WHERE st.parent_id = ${structure.id}) as ID) OR parent_id = ${structure.id};`)
                    .then(() => { });
            })
        },
        sequelize,
        tableName: 'structures'
    });
    return Structure;
};
//# sourceMappingURL=structure.js.map