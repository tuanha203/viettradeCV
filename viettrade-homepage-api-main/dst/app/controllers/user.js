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
const mapper = require("../mapper/user");
const _base_1 = require("./_base");
class UserController extends _base_1.default {
    constructor(db) {
        super(db);
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.create(Object.assign({}, mapper.createFormData(req)));
            this.created(res, result);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.searchId(req.params.id);
            res.json(user);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.userRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.update(mapper.updateFormData(req), req.params.id);
            this.created(res, result);
        });
        this.createAdmin = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.createAdmin(mapper.createFormData(req));
            this.created(res, result);
        });
        this.register = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.register(Object.assign({}, mapper.registerFormData(req)));
            this.created(res, result);
        });
        this.updateUser = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const result = yield this.userRepo.updateUser(mapper.updateFormData(req), (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
            this.created(res, result);
        });
        this.userRepo = new domain_1.repository.User(this.db);
        this.create = this.nextWrapper(this.create);
        this.search = this.nextWrapper(this.search);
        this.searchId = this.nextWrapper(this.searchId);
        this.delete = this.nextWrapper(this.delete);
        this.update = this.nextWrapper(this.update);
        this.register = this.nextWrapper(this.register);
    }
}
exports.default = UserController;
//# sourceMappingURL=user.js.map