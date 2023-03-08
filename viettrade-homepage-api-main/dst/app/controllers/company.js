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
const mapper = require("../mapper/company");
const _base_1 = require("./_base");
class CompanyController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyRepo.create(mapper.createFormData(req), req.file ? '/public/files/' + req.file.filename : undefined);
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyRepo.update(req.params.id, mapper.updateFormData(req), req.file ? '/public/files/' + req.file.filename : undefined);
            this.created(res, result);
        });
        this.updateDisplay = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyRepo.updateDisplay(req.params.id, mapper.updateFormData(req));
            this.created(res, result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const post = yield this.companyRepo.searchId(req.params.id);
            res.json(post);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.searchAll = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyRepo.searchAll(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.companyRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.approve = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.companyRepo.approve(req.params.id, req.body.status);
            this.created(res, result);
        });
        this.companyRepo = new domain_1.repository.Company(this.db);
        this.create = this.nextWrapper(this.create);
    }
}
exports.default = CompanyController;
//# sourceMappingURL=company.js.map