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
class CategoryRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Category;
        this.postModel = db.Post;
    }
    create(data, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newCategory = yield this.model.create({
                    title_vi: data.title_vi,
                    title_en: data.title_en,
                    feature_image: image,
                    display: data.display
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
    update(categoryId, data, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const category = yield this.model.findByPk(categoryId);
                const updateCategory = yield category.update({
                    title_vi: data.title_vi,
                    title_en: data.title_en,
                    feature_image: image
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateCategory.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    updateDisplay(categoryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const category = yield this.model.findByPk(categoryId);
                const updateCategory = yield category.update({
                    display: data.display
                }, { transaction });
                yield transaction.commit();
                return {
                    category: updateCategory
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
                doc.Posts = (0, utils_1.addBaseUrlToData)(doc.Posts, 'feature_image');
            });
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
                    model: this.postModel,
                    limit: 1,
                    order: [['createdAt', 'DESC']],
                    where: { publish: common_1.types.post.Publish.PUBLISH }
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
            findOption.where = { [sequelize_1.Op.and]: andArray };
            if (params.sort !== undefined) {
                if (`${params.sort}`.toLowerCase() === 'desc') {
                    findOption.order = [
                        ['display', 'ASC'],
                        ['createdAt', 'DESC']
                    ];
                }
                else {
                    findOption.order = [
                        ['display', 'ASC'],
                        ['createdAt', 'ASC']
                    ];
                }
            }
            else {
                findOption.order = [
                    ['display', 'ASC'],
                    ['updatedAt', 'ASC']
                ];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
}
exports.default = CategoryRepository;
//# sourceMappingURL=category.js.map