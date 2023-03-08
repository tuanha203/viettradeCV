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
class QuestionRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Question;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const newQuestion = yield this.model.create({
                    question_vi: data.question_vi,
                    answer_vi: data.answer_vi,
                    question_en: data.question_en,
                    answern_en: data.answern_en,
                    display: 0
                }, { transaction });
                yield transaction.commit();
                return {
                    id: newQuestion.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(questionId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                const question = yield this.model.findByPk(questionId);
                const updateQuestion = yield (question === null || question === void 0 ? void 0 : question.update({
                    question_vi: data.question_vi,
                    answer_vi: data.answer_vi,
                    question_en: data.question_en,
                    answern_en: data.answern_en,
                    display: data.display
                }, { transaction }));
                yield transaction.commit();
                return {
                    id: updateQuestion === null || updateQuestion === void 0 ? void 0 : updateQuestion.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    searchId(questionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield this.model.findByPk(questionId);
            return question;
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
                    'question_vi',
                    'answer_vi',
                    'question_en',
                    'answern_en',
                    'display'
                ]));
            }
            if (params.question_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'question_vi'));
            }
            if (params.answer_vi !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'answer_vi'));
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
            const question = yield this.model.findByPk(publicId);
            if (question) {
                return question.destroy();
            }
        });
    }
}
exports.default = QuestionRepository;
//# sourceMappingURL=question.js.map