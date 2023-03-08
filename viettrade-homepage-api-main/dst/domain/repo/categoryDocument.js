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
class CategoryDocumentRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.CategoryDocument;
        this.documentModel = db.Document;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newCategory = yield this.model.create({
                    category_id: data.category_id ? data.category_id : 0,
                    title_vi: data.title_vi,
                    title_en: data.title_en
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newCategory.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(categoryDocumentId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const categoryDocument = yield this.model.findByPk(categoryDocumentId);
                const updateCategoryDocument = yield categoryDocument.update({
                    category_id: data.category_id,
                    title_vi: data.title_vi,
                    title_en: data.title_en
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateCategoryDocument.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    delete(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.model.findByPk(categoryId);
            if (category) {
                return category.destroy();
            }
        });
    }
    searchId(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.model.findByPk(categoryId);
            return category;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = JSON.parse(JSON.stringify(rows));
            rows.map((doc) => {
                var _a;
                doc.Documents = (0, utils_1.addBaseUrlToData)(doc.Documents, 'feature_document');
                (_a = doc.children) === null || _a === void 0 ? void 0 : _a.map((child) => {
                    child.Documents = (0, utils_1.addBaseUrlToData)(child.Documents, 'feature_document');
                });
            });
            return {
                rows,
                count
            };
        });
    }
    makeFindOption(params) {
        const findOption = (params === null || params === void 0 ? void 0 : params.all_levels)
            ? {
                include: [
                    {
                        model: this.model,
                        as: 'children',
                        required: true,
                        include: [
                            {
                                model: this.documentModel,
                                limit: 999999,
                                required: true
                            }
                        ]
                    },
                    {
                        model: this.documentModel,
                        required: true,
                        limit: 999999,
                        order: [['createdAt', 'DESC']]
                    }
                ]
            }
            : {
                include: [
                    {
                        model: this.documentModel,
                        required: true,
                        limit: 1,
                        order: [['createdAt', 'DESC']]
                    },
                    {
                        model: this.model,
                        as: 'parent'
                    }
                ]
            };
        if (params !== undefined) {
            const andArray = [];
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'category_id',
                    'title_vi',
                    'title_en'
                ]));
            }
            if (params.title_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'title_vi'));
            }
            if (params.title_en !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'title_en'));
            }
            if (params.category_id !== undefined) {
                andArray.push({ category_id: params.category_id });
            }
            findOption.where = { [sequelize_1.Op.and]: andArray };
            if (params.sort !== undefined) {
                if (`${params.sort}`.toLowerCase() === 'desc') {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'createdAt', 'DESC']
                    ];
                }
                else {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'createdAt', 'ASC']
                    ];
                }
            }
            else {
                findOption.order = [
                    ['category_id', 'ASC'],
                    ['createdAt', 'ASC']
                ];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
}
exports.default = CategoryDocumentRepository;
//# sourceMappingURL=categoryDocument.js.map