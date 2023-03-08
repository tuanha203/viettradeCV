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
const domain_1 = require("../../domain");
const mapper = require("../mapper/question");
const _base_1 = require("./_base");
class QuestionController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionRepo.create(mapper.createFormData(req));
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionRepo.update(req.params.id, mapper.updateFormData(req));
            this.created(res, result);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.questionRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionRepo.searchId(req.params.id);
            res.json(result);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.questionRepo = new domain_1.repository.Question(this.db);
        this.create = this.nextWrapper(this.create);
    }
}
exports.default = QuestionController;
//# sourceMappingURL=question.js.map