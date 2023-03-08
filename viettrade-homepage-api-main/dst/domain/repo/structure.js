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
class StructureRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Structure;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newStructure = yield this.model.create({
                    parent_id: data.parent_id,
                    full_name_vi: data.full_name_vi,
                    full_name_en: data.full_name_en,
                    position_vi: data.position_vi,
                    position_en: data.position_en,
                    phone: data.phone,
                    email: data.email,
                    fax: data.fax,
                    website: data.website,
                    level: data.level,
                    display: data.display,
                    address: data.address
                }, { transaction });
                yield transaction.commit();
                return {
                    structure: newStructure
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(structureId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const structure = yield this.model.findByPk(structureId);
                const updateStructure = yield structure.update({
                    parent_id: data.parent_id,
                    full_name_vi: data.full_name_vi,
                    full_name_en: data.full_name_en,
                    position_vi: data.position_vi,
                    position_en: data.position_en,
                    phone: data.phone,
                    fax: data.fax,
                    website: data.website,
                    email: data.email,
                    level: data.level,
                    display: data.display,
                    address: data.address
                }, { transaction });
                yield transaction.commit();
                return {
                    structure: updateStructure
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(structureId) {
        return __awaiter(this, void 0, void 0, function* () {
            const structure = yield this.model.findByPk(structureId, {
                include: [
                    {
                        model: this.model,
                        order: [['createdAt', 'DESC']],
                        include: [{ model: this.model, order: [['createdAt', 'DESC']] }]
                    }
                ]
            });
            return structure;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params, false);
            this.setOffsetLimit(findOption, params);
            const { rows, count } = yield this.model.findAndCountAll(findOption);
            return {
                rows,
                count
            };
        });
    }
    searchSub(strucId) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = {
                include: [
                    {
                        model: this.model,
                        order: [['createdAt', 'DESC']],
                        required: false,
                        include: [
                            {
                                model: this.model,
                                order: [['createdAt', 'DESC']],
                                required: false
                            }
                        ]
                    }
                ]
            };
            const andArray = [];
            andArray.push({ parent_id: strucId });
            findOption.where = { [sequelize_1.Op.and]: andArray };
            findOption.order = [['createdAt', 'DESC']];
            const subStructure = yield this.model.findAll(findOption);
            return subStructure;
        });
    }
    searchAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params, true);
            this.setOffsetLimit(findOption, params);
            const { rows, count } = yield this.model.findAndCountAll(findOption);
            return {
                rows,
                count
            };
        });
    }
    updateDisplay(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const structureSource = yield this.model.findByPk(data.source);
            const structureDestination = yield this.model.findByPk(data.destination);
            const transaction = yield this.db.sequelize.transaction();
            try {
                const updateStructureSource = yield structureSource.update({
                    display: data.display_source
                }, { transaction });
                const updateStructureDestination = yield structureDestination.update({
                    display: data.display_destination
                }, { transaction });
                yield transaction.commit();
                return {
                    menuSource: updateStructureSource,
                    menuDestination: updateStructureDestination
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    makeFindOption(params, isSearchAllLevel) {
        const findOption = {
            include: [
                {
                    model: this.model,
                    order: [['createdAt', 'DESC']],
                    required: false,
                    include: [
                        {
                            model: this.model,
                            order: [['createdAt', 'DESC']],
                            required: false
                        }
                    ]
                }
            ]
        };
        if (params !== undefined) {
            const andArray = [];
            if (isSearchAllLevel) {
                andArray.push({
                    ['level']: [1, 2]
                });
            }
            else {
                andArray.push({
                    ['level']: [1]
                });
            }
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'parent_id',
                    'full_name',
                    'position_vi',
                    'position_en',
                    'phone',
                    'fax',
                    'website',
                    'email'
                ]));
            }
            if (params.full_name_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'full_name_vi'));
            }
            if (params.full_name_en !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'full_name_en'));
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
                findOption.order = [['createdAt', 'DESC']];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    delete(structureId) {
        return __awaiter(this, void 0, void 0, function* () {
            const structure = yield this.model.findByPk(structureId);
            const transaction = yield this.db.sequelize.transaction();
            try {
                yield (structure === null || structure === void 0 ? void 0 : structure.destroy());
                yield transaction.commit();
                return {
                    structure: structure
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
}
exports.default = StructureRepository;
//# sourceMappingURL=structure.js.map