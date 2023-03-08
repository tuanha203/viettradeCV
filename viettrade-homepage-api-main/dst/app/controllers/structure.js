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
const mapper = require("../mapper/structure");
const _base_1 = require("./_base");
class StructureController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.structureRepo.create(mapper.createFormData(req));
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.structureRepo.update(req.params.id, mapper.updateFormData(req));
            this.created(res, result);
        });
        this.updateDisplay = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const struc = yield this.structureRepo.updateDisplay(mapper.updateDisplayFormData(req));
            res.json(struc);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.structureRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.searchAll = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.structureRepo.searchAll(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.searchSubStructure = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.structureRepo.searchSub(req.params.id);
            res.json(result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const structure = yield this.structureRepo.searchId(req.params.id);
            res.json(structure);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.structureRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.structureRepo = new domain_1.repository.Structure(this.db);
        this.create = this.nextWrapper(this.create);
        this.update = this.nextWrapper(this.update);
        this.updateDisplay = this.nextWrapper(this.updateDisplay);
    }
}
exports.default = StructureController;
//# sourceMappingURL=structure.js.map