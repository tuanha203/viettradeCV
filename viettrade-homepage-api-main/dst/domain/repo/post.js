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
class PostRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Post;
        this.categoryModel = db.Category;
    }
    create(data, fileName, documentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newPost = yield this.model.create({
                    category_id: data.category_id,
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    description_en: data.description_en,
                    feature_image: fileName,
                    feature_document: documentFile,
                    publish: data.publish
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newPost.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(postId, data, fileName, documentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const post = yield this.model.findByPk(postId);
                const updatePost = yield post.update({
                    category_id: data.category_id,
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    description_en: data.description_en,
                    feature_image: fileName,
                    publish: data.publish,
                    feature_document: documentFile
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updatePost.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            let post = yield this.model.findByPk(postId);
            post = (0, utils_1.addBaseUrlToData)(post, 'feature_image');
            return post;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = yield this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_image');
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
                        model: this.categoryModel,
                        required: true,
                        attributes: ['id', 'title_vi', 'title_en']
                    }
                ]
            };
            if (params !== undefined) {
                const andArray = [];
                if (params.search !== undefined) {
                    andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                        'category_id',
                        'title_vi',
                        'content_vi',
                        'description_vi',
                        'title_en',
                        'content_en',
                        'description_en'
                    ]));
                }
                if (params.publish !== undefined) {
                    andArray.push(utils_1.query.makeAmbiguousCondition(params, 'publish'));
                }
                if (params.role !== undefined) {
                    if (parseInt(params.role) === common_1.types.admin.Role.ADMIN ||
                        parseInt(params.role) === common_1.types.admin.Role.MANAGER) {
                        andArray.push({
                            ['publish']: {
                                [sequelize_1.Op.in]: [common_1.types.post.Publish.PRIVATE, common_1.types.post.Publish.PUBLISH]
                            }
                        });
                    }
                    else {
                        andArray.push({
                            ['publish']: {
                                [sequelize_1.Op.in]: [common_1.types.post.Publish.PRIVATE, common_1.types.post.Publish.DRAFT]
                            }
                        });
                    }
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
                        [params.sortColumn ? params.sortColumn : 'createdAt', 'DESC']
                    ];
                }
                findOption.distinct = true;
                findOption.subQuery = false;
            }
            return findOption;
        });
    }
    countView(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.model.increment({
                    view_count: 1
                }, {
                    where: {
                        id: postId
                    }
                });
                return {
                    id: postId
                };
            }
            catch (error) {
                throw error;
            }
        });
    }
    approve(postId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const post = yield this.model.findByPk(postId);
                const updatePost = yield post.update({
                    publish: status
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updatePost.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    delete(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    id: postId
                }
            });
        });
    }
}
exports.default = PostRepository;
//# sourceMappingURL=post.js.map