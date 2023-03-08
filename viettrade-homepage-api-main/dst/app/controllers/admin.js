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
const jwt = require("jsonwebtoken");
const domain_1 = require("../../domain");
const mapper = require("../mapper/admin");
const _base_1 = require("./_base");
class AdminController extends _base_1.default {
    constructor(db) {
        super(db);
        this.expiresIn = process.env.JWT_EXPIRATION || '3600s'; // default to 60 minutes
        this.jwtSecret = process.env.JWT_SECRET || 'viettrade';
        this.refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE || '30'); // default to 30
        this.create = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminRepo.create(Object.assign({}, mapper.createFormData(req)), req.file ? '/public/files/' + req.file.filename : undefined);
            this.created(res, result);
        });
        this.search = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminRepo.search(Object.assign(Object.assign({}, mapper.searchData(req)), this.getOffsetLimit(req)));
            this.ok(res, result);
        });
        this.searchId = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.adminRepo.searchId(req.params.id);
            res.json(user);
        });
        this.delete = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            yield this.adminRepo.delete(req.params.id);
            res.json({ success: true });
        });
        this.update = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminRepo.update(mapper.updateFormData(req), req.params.id, req.file ? './public/files/' + req.file.filename : undefined);
            this.created(res, result);
        });
        this.createAdmin = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminRepo.createAdmin(mapper.createFormData(req), req.file ? '/public/files/' + req.file.filename : undefined);
            this.created(res, result);
        });
        this.login = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            let admin = yield this.adminRepo.login({
                email: req.body.email,
                password: req.body.password
            });
            if (!(admin.success === false)) {
                admin = JSON.parse(JSON.stringify(admin));
                const token = yield this.signToken(admin);
                res.setHeader('X-Token-Expiration', this.refreshTokenMaxAge);
                res.json(Object.assign(Object.assign({}, admin), { token }));
                const extend = {
                    apiNm: 'login',
                    params: {
                        email: admin.email
                    }
                };
                req.user = admin;
                this.logClientInfo(req, extend);
            }
            else {
                res.json(admin);
            }
        });
        this.signToken = (data) => __awaiter(this, void 0, void 0, function* () {
            const token = jwt.sign(data, this.jwtSecret, {
                expiresIn: this.expiresIn
            });
            const result = {
                accessToken: token
            };
            return result;
        });
        this.getAdminInfo = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (req.user) {
                const user = yield this.adminRepo.searchId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
                res.json(user);
            }
            else {
                res.json(null);
            }
        });
        this.adminRepo = new domain_1.repository.Admin(this.db);
        this.create = this.nextWrapper(this.create);
        this.search = this.nextWrapper(this.search);
        this.searchId = this.nextWrapper(this.searchId);
        this.delete = this.nextWrapper(this.delete);
        this.update = this.nextWrapper(this.update);
    }
}
exports.default = AdminController;
//# sourceMappingURL=admin.js.map