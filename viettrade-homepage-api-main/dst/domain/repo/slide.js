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
class SlideRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Slide;
    }
    create(data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newSlide = yield this.model.create({
                    title: data.title,
                    link: data.link,
                    display: data.display,
                    feature_image: fileName
                }, { transaction });
                yield transaction.commit();
                return {
                    slide: newSlide
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(slideId, data, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const slide = yield this.model.findByPk(slideId);
                const updateSlide = yield slide.update({
                    title: data.title,
                    link: data.link,
                    display: data.display,
                    feature_image: fileName
                }, { transaction });
                yield transaction.commit();
                return {
                    slide: updateSlide
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(slideId) {
        return __awaiter(this, void 0, void 0, function* () {
            let slide = yield this.model.findByPk(slideId);
            slide = (0, utils_1.addBaseUrlToData)(slide, 'feature_image');
            return slide;
        });
    }
    updateDisplay(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const slideSource = yield this.model.findByPk(data.source);
            const slideDestination = yield this.model.findByPk(data.destination);
            const transaction = yield this.db.sequelize.transaction();
            try {
                const updateSlideSource = yield slideSource.update({
                    display: data.display_source
                }, { transaction });
                const updateSlideDestination = yield slideDestination.update({
                    display: data.display_destination
                }, { transaction });
                yield transaction.commit();
                return {
                    SlideSource: updateSlideSource,
                    SlideDestination: updateSlideDestination
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
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
    makeFindOption(params) {
        const findOption = {
            include: []
        };
        if (params !== undefined) {
            const andArray = [];
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'title',
                    'link'
                ]));
            }
            if (params.title !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'title'));
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
                findOption.order = [['createdAt', 'ASC']];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    delete(slideId) {
        return __awaiter(this, void 0, void 0, function* () {
            const slide = yield this.model.findByPk(slideId);
            const transaction = yield this.db.sequelize.transaction();
            try {
                yield (slide === null || slide === void 0 ? void 0 : slide.destroy());
                yield transaction.commit();
                return {
                    slide: slide
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
}
exports.default = SlideRepository;
//# sourceMappingURL=slide.js.map