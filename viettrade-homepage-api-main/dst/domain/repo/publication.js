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
class PublicationRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Publication;
    }
    create(data, fileImage, filePdf) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newPublic = yield this.model.create({
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    description_en: data.description_en,
                    pdf_file: filePdf,
                    display: data.display,
                    feature_image: fileImage
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newPublic.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(publicId, data, fileImage, filePdf) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const publication = yield this.model.findByPk(publicId);
                const updatePublic = yield publication.update({
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    description_vi: data.description_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    description_en: data.description_en,
                    pdf_file: filePdf,
                    display: data.display,
                    feature_image: fileImage
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updatePublic.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            let publication = yield this.model.findByPk(publicId);
            publication = (0, utils_1.addBaseUrlToData)(publication, 'feature_image');
            publication = (0, utils_1.addBaseUrlToData)(publication, 'pdf_file');
            return publication;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_image');
            rows = (0, utils_1.addBaseUrlToData)(rows, 'pdf_file');
            return {
                rows,
                count
            };
        });
    }
    makeFindOption(params) {
        const findOption = {
            include: []
        };
        if (params !== undefined) {
            const andArray = [];
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'title_vi',
                    'content_vi',
                    'title_en',
                    'content_en',
                    'pdf_file'
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
                findOption.order = [['createdAt', 'ASC']];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    delete(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const publication = yield this.model.findByPk(publicId);
            if (publication) {
                return publication.destroy();
            }
        });
    }
}
exports.default = PublicationRepository;
//# sourceMappingURL=publication.js.map