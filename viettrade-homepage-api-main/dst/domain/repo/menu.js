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
const sequelize_1 = require("sequelize");
const utils_1 = require("../utils");
const _base_1 = require("./_base");
class MenuRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Menu;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newMenu = yield this.model.create({
                    title_vi: data.title_vi,
                    title_en: data.title_en,
                    link: data.link,
                    display: data.display,
                    parent_id: data.parent_id
                }, { transaction });
                yield transaction.commit();
                return {
                    menu: newMenu
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(menuId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const menu = yield this.model.findByPk(menuId);
                const updateMenu = yield menu.update({
                    title_vi: data.title_vi,
                    title_en: data.title_en,
                    link: data.link,
                    display: data.display,
                    parent_id: data.parent_id
                }, { transaction });
                yield transaction.commit();
                return {
                    menu: updateMenu
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield this.model.findByPk(menuId);
            return menu;
        });
    }
    searchSubMenu(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = {
                include: []
            };
            const andArray = [];
            andArray.push({ parent_id: menuId });
            findOption.where = { [sequelize_1.Op.and]: andArray };
            findOption.order = [['createdAt', 'DESC']];
            const subMenu = yield this.model.findAll(findOption);
            return subMenu;
        });
    }
    updateDisplay(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const menuSource = yield this.model.findByPk(data.source);
            const menuDestination = yield this.model.findByPk(data.destination);
            const transaction = yield this.db.sequelize.transaction();
            try {
                const updateMenuSource = yield menuSource.update({
                    display: data.display_source
                }, { transaction });
                const updateMenuDestination = yield menuDestination.update({
                    display: data.display_destination
                }, { transaction });
                yield transaction.commit();
                return {
                    menuSource: updateMenuSource,
                    menuDestination: updateMenuDestination
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            const { rows, count } = yield this.model.findAndCountAll(findOption);
            return {
                rows,
                count
            };
        });
    }
    makeFindOption(params) {
        const findOption = {
            include: [
                {
                    model: this.model,
                    order: [['createdAt', 'DESC']],
                    include: [{ model: this.model, order: [['createdAt', 'DESC']] }]
                }
            ]
        };
        if (params !== undefined) {
            const andArray = [];
            andArray.push({
                ['parent_id']: 0
            });
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'title_vi',
                    'title_en',
                    'link'
                ]));
            }
            if (params.title_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'title_vi'));
            }
            findOption.where = { [sequelize_1.Op.and]: andArray };
            if (params.sort !== undefined) {
                if (`${params.sort}`.toLowerCase() === 'desc') {
                    findOption.order = [['createdAt', 'DESC']];
                }
                else {
                    findOption.order = [['createdAt', 'ASC']];
                }
            }
            else {
                findOption.order = [['createdAt', 'ASC']];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    delete(menuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield this.model.findByPk(menuId);
            const transaction = yield this.db.sequelize.transaction();
            try {
                yield (menu === null || menu === void 0 ? void 0 : menu.destroy());
                yield transaction.commit();
                return {
                    menu: menu
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
}
exports.default = MenuRepository;
//# sourceMappingURL=menu.js.map