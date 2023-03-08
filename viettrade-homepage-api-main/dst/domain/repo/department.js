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
class DepartmentRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Department;
    }
    create(data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newDepartment = yield this.model.create({
                    parent_id: data.parent_id,
                    full_name: data.full_name,
                    position_vi: data.position_vi,
                    position_en: data.position_en,
                    phone: data.phone,
                    email: data.email,
                    feature_image: fileName
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newDepartment.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(departmentId, data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const department = yield this.model.findByPk(departmentId);
                const updateDepartment = yield department.update({
                    parent_id: data.parent_id,
                    full_name: data.full_name,
                    position_vi: data.position_vi,
                    position_en: data.position_en,
                    phone: data.phone,
                    email: data.email,
                    feature_image: fileName
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateDepartment.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let department = yield this.model.findByPk(departmentId, {
                include: [
                    {
                        model: this.model,
                        order: [['createdAt', 'DESC']],
                        include: [{ model: this.model, order: [['createdAt', 'DESC']] }]
                    }
                ]
            });
            department = (0, utils_1.addBaseUrlToData)(department, 'feature_image');
            return department;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params, false);
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
            const findOption = this.makeFindOption(params, true);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_image');
            return {
                rows,
                count
            };
        });
    }
    makeFindOption(params, isSearchAll) {
        const findOption = isSearchAll
            ? {}
            : {
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
            if (!isSearchAll) {
                andArray.push({
                    ['parent_id']: '0'
                });
            }
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'parent_id',
                    'full_name',
                    'position_vi',
                    'position_en',
                    'phone',
                    'email'
                ]));
            }
            if (params.full_name !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'full_name'));
            }
            if (params.parent_id !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'parent_id'));
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
    delete(departmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    id: departmentId
                }
            });
        });
    }
}
exports.default = DepartmentRepository;
//# sourceMappingURL=department.js.map