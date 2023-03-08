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
const mapper = require("../mapper/menu");
const _base_1 = require("./_base");
class MenuController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.menuRepo.create(mapper.createFormData(req));
            this.created(res, result);
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.menuRepo.update(req.params.id, mapper.updateFormData(req));
            this.created(res, result);
        });
        this.updateDisplay = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const menu = yield this.menuRepo.updateDisplay(mapper.updateDisplayFormData(req));
            res.json(menu);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.menuRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.menuRepo.searchId(req.params.id);
            res.json(result);
        });
        this.searchSubMenu = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.menuRepo.searchSubMenu(req.params.id);
            res.json(result);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.menuRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.menuRepo = new domain_1.repository.Menu(this.db);
        this.create = this.nextWrapper(this.create);
        this.update = this.nextWrapper(this.update);
        this.updateDisplay = this.nextWrapper(this.updateDisplay);
    }
}
exports.default = MenuController;
//# sourceMappingURL=menu.js.map