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
const mapper = require("../mapper/digital");
const _base_1 = require("./_base");
class DigitalController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const result = yield this.digitalRepo.create(mapper.createFormData(req), files.feature_image ? files.feature_image[0].path : undefined, files.feature_icon ? files.feature_icon[0].path : undefined);
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const result = yield this.digitalRepo.update(req.params.id, mapper.updateFormData(req), files.feature_image ? files.feature_image[0].path : undefined, files.feature_icon ? files.feature_icon[0].path : undefined);
            this.created(res, result);
        });
        this.updateDisplay = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const slide = yield this.digitalRepo.updateDisplay(mapper.updateDisplayFormData(req));
            res.json(slide);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.digitalRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.digitalRepo.searchId(req.params.id);
            res.json(result);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.digitalRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.digitalRepo = new domain_1.repository.Digital(this.db);
        this.create = this.nextWrapper(this.create);
        this.update = this.nextWrapper(this.update);
        this.searchId = this.nextWrapper(this.searchId);
        this.search = this.nextWrapper(this.search);
        this.delete = this.nextWrapper(this.delete);
    }
}
exports.default = DigitalController;
//# sourceMappingURL=digital.js.map