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
exports.hashPassword = void 0;
const crypto = require("crypto");
const sequelize_1 = require("sequelize");
const common_1 = require("../../common");
const utils_1 = require("../utils");
const _base_1 = require("./_base");
const index_1 = require("./../utils/index");
class AdminRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.Admin;
    }
    create(data, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                // userデータ
                const admin = yield this.model.findOne({ where: { email: data.email } });
                if (admin) {
                    throw new common_1.errors.Argument('email', common_1.messages.errorIsExist('email'));
                }
                const newAdmin = yield this.model.create(Object.assign(Object.assign({}, hashPassword(data.password)), { role: data.role, name: data.name, email: data.email, feature_image: filename, status: data.status ? data.status : common_1.types.admin.Status.ACTIVE }), { transaction });
                yield transaction.commit();
                return {
                    id: newAdmin.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(data, adminId, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                let admin;
                if (data.email !== undefined) {
                    admin = yield this.model.findOne({
                        where: { email: data.email }
                    });
                    if (admin && admin.id !== parseInt(adminId)) {
                        throw new common_1.errors.Argument('email', common_1.messages.errorIsExist('email'));
                    }
                    admin = yield this.model.findByPk(adminId);
                }
                else {
                    admin = yield this.model.findByPk(adminId);
                }
                const updateAdmin = yield admin.update(Object.assign(Object.assign({}, hashPassword(data.password ? data.password : '')), { role: data.role, name: data.name, email: data.email, status: data.status, feature_image: filename }), { transaction });
                yield transaction.commit();
                return {
                    id: updateAdmin.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    search(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOption = this.makeFindOption(params);
            this.setOffsetLimit(findOption, params);
            let { rows, count } = yield this.model.findAndCountAll(findOption);
            rows = (0, index_1.addBaseUrlToData)(rows, 'feature_image');
            return {
                rows,
                count
            };
        });
    }
    makeFindOption(params) {
        const findOption = {
            include: []
        };
        if (params !== undefined) {
            const andArray = [];
            if (params.search !== undefined) {
                andArray.push(utils_1.query.makeMultipleAmbiguousCondition(params, 'search', [
                    'name',
                    'email'
                ]));
            }
            if (params.type !== undefined) {
                if (params.type === 'admin') {
                    andArray.push({
                        role: [common_1.types.admin.Role.ADMIN, common_1.types.admin.Role.CONTENT]
                    });
                }
            }
            if (params.email !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'email'));
            }
            if (params.role !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'role'));
            }
            if (params.status !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'status'));
            }
            findOption.where = { [sequelize_1.Op.and]: andArray };
            if (params.sort !== undefined) {
                if (`${params.sort}`.toLowerCase() === 'desc') {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'createdAt', 'DESC']
                    ];
                }
                else {
                    findOption.order = [
                        [params.sortColumn ? params.sortColumn : 'createdAt', 'ASC']
                    ];
                }
            }
            else {
                findOption.order = [['createdAt', 'ASC']];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
        }
        return findOption;
    }
    searchId(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            let admin = yield this.model.findByPk(adminId);
            admin = (0, index_1.addBaseUrlToData)(admin, 'feature_image');
            return admin;
        });
    }
    delete(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    id: adminId
                }
            });
        });
    }
    createAdmin(data, filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                // userデータ
                const newAdmin = yield this.model.create(Object.assign(Object.assign({}, hashPassword(data.password)), { role: data.role, name: data.name, email: data.email, status: common_1.types.admin.Status.ACTIVE, feature_image: filename }), { transaction });
                yield transaction.commit();
                return {
                    id: newAdmin.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminInfo = yield this.model.findOne({
                where: {
                    email: params.email
                }
            });
            if (adminInfo !== null) {
                if (adminInfo.status === common_1.types.admin.Status.INACTIVE) {
                    return { success: false, messages: [common_1.messages.inActive] };
                }
                if ([
                    common_1.types.admin.Role.ADMIN,
                    common_1.types.admin.Role.CONTENT,
                    common_1.types.admin.Role.MANAGER
                ].indexOf(adminInfo.role) === -1) {
                    return { success: false, messages: [common_1.messages.dataMismatchingError] };
                }
            }
            else {
                return { success: false, messages: [common_1.messages.passwordError] };
            }
            const hashedPassword = crypto
                .createHmac('sha256', adminInfo.salt)
                .update(params.password)
                .digest('hex');
            if (hashedPassword !== adminInfo.password) {
                // password not match, return error
                return { success: false, messages: [common_1.messages.passwordError] };
                // throw new errors.Argument('email, password', messages.passwordError);
            }
            adminInfo.set('lastLoginAt', new Date());
            yield adminInfo.save();
            let newAdminInfo = adminInfo;
            newAdminInfo = (0, index_1.addBaseUrlToData)(adminInfo, 'feature_image');
            return newAdminInfo;
        });
    }
}
exports.default = AdminRepository;
function hashPassword(password) {
    if (password !== '') {
        const randomSalt = Math.random()
            .toString(36)
            .substring(2)
            .substring(0, 10);
        const hashedPassword = crypto
            .createHmac('sha256', randomSalt)
            .update(password)
            .digest('hex');
        return {
            salt: randomSalt,
            password: hashedPassword
        };
    }
    return;
}
exports.hashPassword = hashPassword;
//# sourceMappingURL=admin.js.map