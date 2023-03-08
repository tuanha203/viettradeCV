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
class GalleryRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Gallery;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newGallery = yield this.model.create({
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    feature_video: data.feature_video
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newGallery.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(galleryId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const gallery = yield this.model.findByPk(galleryId);
                const updateGallery = yield gallery.update({
                    title_vi: data.title_vi,
                    content_vi: data.content_vi,
                    title_en: data.title_en,
                    content_en: data.content_en,
                    feature_video: data.feature_video
                }, { transaction });
                yield transaction.commit();
                return {
                    id: updateGallery.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(galleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gallery = yield this.model.findByPk(galleryId);
            return gallery;
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
            include: []
        };
        if (params !== undefined) {
            const andArray = [];
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'title_vi',
                    'content_vi',
                    'title_en',
                    'content_en'
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
    delete(galleryId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    id: galleryId
                }
            });
        });
    }
}
exports.default = GalleryRepository;
//# sourceMappingURL=gallery.js.map