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
class DigitalRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Digital;
    }
    create(data, fileName, iconFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newDigital = yield this.model.create({
                    title_vi: data.title_vi,
                    title_en: data.title_en,
                    feature_image: fileName,
                    feature_icon: iconFile,
                    link: data.link,
                    display: 0
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newDigital.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(digitalId, data, fileName, iconFile) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const digital = yield this.model.findByPk(digitalId);
                const updateDigital = yield (digital === null || digital === void 0 ? void 0 : digital.update({
                    title_vi: data.title_vi,
                    title_en: data.title_en,
                    feature_image: fileName,
                    feature_icon: iconFile,
                    link: data.link,
                    display: data.display
                }, { transaction }));
                yield transaction.commit();
                return {
                    id: updateDigital === null || updateDigital === void 0 ? void 0 : updateDigital.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    updateDisplay(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const digitalSource = yield this.model.findByPk(data.source);
            const digitalDestination = yield this.model.findByPk(data.destination);
            const transaction = yield this.db.sequelize.transaction();
            try {
                const updateDigitalSource = yield digitalSource.update({
                    display: data.display_source
                }, { transaction });
                const updateDigitalDestination = yield digitalDestination.update({
                    display: data.display_destination
                }, { transaction });
                yield transaction.commit();
                return {
                    DigitalSource: updateDigitalSource,
                    DigitalDestination: updateDigitalDestination
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(digitalId) {
        return __awaiter(this, void 0, void 0, function* () {
            let digital = yield this.model.findByPk(digitalId);
            digital = (0, utils_1.addBaseUrlToData)(digital, 'feature_image');
            digital = (0, utils_1.addBaseUrlToData)(digital, 'feature_icon');
            return digital;
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_image');
            rows = (0, utils_1.addBaseUrlToData)(rows, 'feature_icon');
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
                    'title_en',
                    'display'
                ]));
            }
            if (params.title_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'title_vi'));
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
                    ['createdAt', 'ASC']
                ];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    delete(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            const digital = yield this.model.findByPk(publicId);
            if (digital) {
                return digital.destroy();
            }
        });
    }
}
exports.default = DigitalRepository;
//# sourceMappingURL=digital.js.map