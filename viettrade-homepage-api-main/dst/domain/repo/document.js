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
class DocumentRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Document;
        this.categoryDocumentModel = db.CategoryDocument;
    }
    create(data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newDocument = yield this.model.create({
                    category_id: data.category_id,
                    title_vi: data.title_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    description_en: data.description_en,
                    feature_document: fileName
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newDocument.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(postId, data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const document = yield this.model.findByPk(postId);
                const updateDocument = yield document.update({
                    category_id: data.category_id,
                    title_vi: data.title_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    description_en: data.description_en,
                    feature_document: fileName
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateDocument.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            let document = yield this.model.findByPk(documentId);
            document = (0, utils_1.addBaseUrlToData)(document, 'feature_document');
            return document;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = yield this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_document');
            return {
                rows,
                count
            };
        });
    }
    makeFindOption(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = {
                include: [
                    {
                        model: this.categoryDocumentModel,
                        required: true,
                        attributes: [
                            'id',
                            'title_vi',
                            'title_en',
                            ['category_id', 'parent_category_id']
                        ]
                    }
                ]
            };
            if (params !== undefined) {
                const andArray = [];
                if (params.search !== undefined) {
                    andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                        'category_id',
                        'title_vi',
                        'description_vi',
                        'title_en',
                        'description_en'
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
                            params.sortColumn === 'parent_category_id'
                                ? [{ model: this.categoryDocumentModel }, 'category_id', 'DESC']
                                : [params.sortColumn || 'createdAt', 'DESC']
                        ];
                    }
                    else {
                        findOption.order = [
                            params.sortColumn === 'parent_category_id'
                                ? [{ model: this.categoryDocumentModel }, 'category_id', 'ASC']
                                : [params.sortColumn || 'createdAt', 'ASC']
                        ];
                    }
                }
                else {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'createdAt', 'DESC']
                    ];
                }
                findOption.distinct = true;
                findOption.subQuery = false;
            }
            return findOption;
        });
    }
    delete(documentId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    id: documentId
                }
            });
        });
    }
}
exports.default = DocumentRepository;
//# sourceMappingURL=document.js.map