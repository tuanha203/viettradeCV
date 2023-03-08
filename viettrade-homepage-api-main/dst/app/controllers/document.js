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
const mapper = require("../mapper/document");
const _base_1 = require("./_base");
class DocumentController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.documentRepo.create(mapper.createFormData(req), req.file ? '/' + req.file.path : undefined);
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.documentRepo.update(req.params.id, mapper.updateFormData(req), req.file ? '/' + req.file.path : undefined);
            this.created(res, result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.documentRepo.searchId(req.params.id);
            res.json(document);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.documentRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.documentRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.documentRepo = new domain_1.repository.Document(this.db);
        this.create = this.nextWrapper(this.create);
        this.update = this.nextWrapper(this.update);
        this.searchId = this.nextWrapper(this.searchId);
        this.search = this.nextWrapper(this.search);
        this.delete = this.nextWrapper(this.delete);
    }
}
exports.default = DocumentController;
//# sourceMappingURL=document.js.map