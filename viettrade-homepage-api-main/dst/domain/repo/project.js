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
class ProjectRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Project;
        this.categoryModel = db.Category;
    }
    create(data, fileName, documentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newProject = yield this.model.create({
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    description_en: data.description_en,
                    feature_image: fileName,
                    feature_document: documentFile
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newProject.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(projectId, data, fileName, documentFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const project = yield this.model.findByPk(projectId);
                const updateProject = yield project.update({
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    description_en: data.description_en,
                    feature_image: fileName,
                    feature_document: documentFile
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateProject.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            let project = yield this.model.findByPk(projectId);
            project = (0, utils_1.addBaseUrlToData)(project, 'feature_image');
            return project;
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
                include: []
            };
            if (params !== undefined) {
                const andArray = [];
                if (params.search !== undefined) {
                    andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                        'title_vi',
                        'content_vi',
                        'description_vi',
                        'title_en',
                        'content_en',
                        'description_en'
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
    delete(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    id: projectId
                }
            });
        });
    }
}
exports.default = ProjectRepository;
//# sourceMappingURL=project.js.map