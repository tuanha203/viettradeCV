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
const mapper = require("../mapper/project");
const _base_1 = require("./_base");
class ProjectController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const files = req.files;
            let feature_documents = [];
            (_a = files.feature_document) === null || _a === void 0 ? void 0 : _a.map((document) => {
                feature_documents.push(process.env.IMAGE_URL + document.path);
            });
            const result = yield this.projectRepo.create(mapper.createFormData(req), files.feature_image ? files.feature_image[0].path : undefined, feature_documents ? JSON.stringify(feature_documents) : undefined);
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            const files = req.files;
            let feature_documents = [];
            (_b = files.feature_document) === null || _b === void 0 ? void 0 : _b.map((document) => {
                feature_documents.push(process.env.IMAGE_URL + document.path);
            });
            const result = yield this.projectRepo.update(req.params.id, mapper.updateFormData(req), files.feature_image ? files.feature_image[0].path : undefined, feature_documents.length ? JSON.stringify(feature_documents) : undefined);
            this.created(res, result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const project = yield this.projectRepo.searchId(req.params.id);
            res.json(project);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.projectRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.projectRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.uploadFile = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            var _c;
            res.json({ location: '/public/files/' + ((_c = req.file) === null || _c === void 0 ? void 0 : _c.filename) });
            // process.env.HOSTNAME +
        });
        this.projectRepo = new domain_1.repository.Project(this.db);
        this.create = this.nextWrapper(this.create);
        this.update = this.nextWrapper(this.update);
        this.searchId = this.nextWrapper(this.searchId);
        this.search = this.nextWrapper(this.search);
        this.delete = this.nextWrapper(this.delete);
    }
}
exports.default = ProjectController;
//# sourceMappingURL=project.js.map