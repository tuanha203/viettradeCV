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
const mapper = require("../mapper/publication");
const _base_1 = require("./_base");
class PublicationController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const result = yield this.publicationRepo.create(mapper.createFormData(req), files.feature_image ? '/' + files.feature_image[0].path : undefined, files.pdf_file ? '/' + files.pdf_file[0].path : undefined);
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const files = req.files;
            const result = yield this.publicationRepo.update(req.params.id, mapper.updateFormData(req), files.feature_image ? '/' + files.feature_image[0].path : undefined, files.pdf_file ? '/' + files.pdf_file[0].path : undefined);
            this.created(res, result);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.publicationRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const post = yield this.publicationRepo.searchId(req.params.id);
            res.json(post);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.publicationRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.publicationRepo = new domain_1.repository.Publication(this.db);
        this.create = this.nextWrapper(this.create);
        this.update = this.nextWrapper(this.update);
    }
}
exports.default = PublicationController;
//# sourceMappingURL=publication.js.map