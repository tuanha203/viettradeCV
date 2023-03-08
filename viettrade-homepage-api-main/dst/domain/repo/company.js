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
const common_1 = require("../../common");
const utils_1 = require("../utils");
const _base_1 = require("./_base");
class CompanyRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Company;
    }
    create(data, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newCompany = yield this.model.create({
                    name_vi: data.name_vi,
                    description_vi: data.description_vi,
                    name_en: data.name_en,
                    description_en: data.description_en,
                    feature_image: image,
                    link: data.link,
                    display: 0,
                    connective: data.connective,
                    phone: data.phone,
                    address: data.address,
                    status: 1
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newCompany.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(companyId, data, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const company = yield this.model.findByPk(companyId);
                const updateCompany = yield company.update({
                    name_vi: data.name_vi,
                    description_vi: data.description_vi,
                    name_en: data.name_en,
                    description_en: data.description_en,
                    feature_image: image,
                    link: data.link,
                    display: data.display,
                    connective: data.connective,
                    phone: data.phone,
                    address: data.address
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateCompany.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    updateDisplay(companyId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const company = yield this.model.findByPk(companyId);
                const updateCompany = yield company.update({
                    display: data.display
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateCompany.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            let company = yield this.model.findByPk(companyId);
            company = (0, utils_1.addBaseUrlToData)(company, 'feature_image');
            return company;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_image');
            return {
                rows,
                count
            };
        });
    }
    searchAll(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOptionAll(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_image');
            return {
                rows,
                count
            };
        });
    }
    makeFindOptionAll(params) {
        const findOption = {
            include: []
        };
        if (params !== undefined) {
            const andArray = [];
            if (params.status !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'status'));
            }
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'name_vi',
                    'description_vi',
                    'name_en',
                    'description_en',
                    'link'
                ]));
            }
            if (params.name_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'name_vi'));
            }
            if (params.name_en !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'name_en'));
            }
            if (params.connective !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'connective'));
            }
            findOption.where = { [sequelize_1.Op.and]: andArray };
            if (params.sort !== undefined) {
                if (`${params.sort}`.toLowerCase() === 'desc') {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'display', 'DESC'],
                        ['updatedAt', 'DESC']
                    ];
                }
                else {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'display', 'ASC'],
                        ['updatedAt', 'ASC']
                    ];
                }
            }
            else {
                findOption.order = [
                    ['display', 'ASC'],
                    ['updatedAt', 'DESC']
                ];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    makeFindOption(params) {
        const findOption = {
            include: []
        };
        if (params !== undefined) {
            const andArray = [];
            andArray.push({
                ['status']: {
                    [sequelize_1.Op.in]: [common_1.types.company.Status.ACTIVE]
                }
            });
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'name_vi',
                    'description_vi',
                    'name_en',
                    'description_en',
                    'link'
                ]));
            }
            if (params.name_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'name_vi'));
            }
            if (params.name_en !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'name_en'));
            }
            if (params.connective !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'connective'));
            }
            findOption.where = { [sequelize_1.Op.and]: andArray };
            if (params.sort !== undefined) {
                if (`${params.sort}`.toLowerCase() === 'desc') {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'display', 'DESC'],
                        ['updatedAt', 'DESC']
                    ];
                }
                else {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'display', 'ASC'],
                        ['updatedAt', 'ASC']
                    ];
                }
            }
            else {
                findOption.order = [
                    ['display', 'ASC'],
                    ['updatedAt', 'DESC']
                ];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    approve(companyId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const company = yield this.model.findByPk(companyId);
                const updateCompany = yield company.update({
                    status: status
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateCompany.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    delete(companyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = yield this.model.findByPk(companyId);
            if (company) {
                return company.destroy();
            }
        });
    }
}
exports.default = CompanyRepository;
//# sourceMappingURL=company.js.map