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
class UserRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.User;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                // userデータ
                const user = yield this.model.findOne({ where: { email: data.email } });
                if (user) {
                    throw new common_1.errors.Argument('email', common_1.messages.errorIsExist('email'));
                }
                const newUser = yield this.model.create(Object.assign(Object.assign({}, hashPassword(data.password)), { role: common_1.types.user.Role.USER, name: data.name, email: data.email, phone: data.phone, status: data.status ? data.status : common_1.types.user.Status.ACTIVE }), { transaction });
                yield transaction.commit();
                return {
                    id: newUser.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    update(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                let user;
                if (data.email !== undefined) {
                    user = yield this.model.findOne({
                        where: { email: data.email }
                    });
                    if (user && user.id !== parseInt(userId)) {
                        throw new common_1.errors.Argument('email', common_1.messages.errorIsExist('email'));
                    }
                    user = yield this.model.findByPk(userId);
                }
                else {
                    user = yield this.model.findByPk(userId);
                }
                const updateUser = yield user.update(Object.assign(Object.assign({}, hashPassword(data.password ? data.password : '')), { role: data.role, phone: data.phone, name: data.name, email: data.email, status: data.status }), { transaction });
                yield transaction.commit();
                return {
                    id: updateUser.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    updateUser(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                let user;
                if (!userId) {
                    throw new common_1.errors.Argument('userId', common_1.messages.authError);
                }
                if (data.email !== undefined) {
                    user = yield this.model.findOne({
                        where: { email: data.email }
                    });
                    if (user && user.id !== userId) {
                        throw new common_1.errors.Argument('email', common_1.messages.errorIsExist('email'));
                    }
                    user = yield this.model.findByPk(userId);
                }
                else {
                    user = yield this.model.findByPk(userId);
                }
                const updateUser = yield user.update(Object.assign(Object.assign({}, hashPassword(data.password ? data.password : '')), { phone: data.phone, name: data.name, email: data.email }), { transaction });
                yield transaction.commit();
                return {
                    id: updateUser.id
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
            const { rows, count } = yield this.model.findAndCountAll(findOption);
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
                    'email',
                    'phone'
                ]));
            }
            if (params.type !== undefined) {
                if (params.type === 'user') {
                    andArray.push({ role: common_1.types.user.Role.USER });
                }
                if (params.type === 'admin') {
                    andArray.push({
                        role: [common_1.types.user.Role.ADMIN, common_1.types.user.Role.CONTENT]
                    });
                }
            }
            if (params.email !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'email'));
            }
            if (params.status !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'status'));
            }
            if (params.phone !== undefined) {
                andArray.push(utils_1.query.makeAmbiguousCondition(params, 'phone'));
            }
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
                findOption.order = [['createdAt', 'DESC']];
            }
            findOption.distinct = true;
            findOption.subQuery = false;
            findOption.where = { [sequelize_1.Op.and]: andArray };
        }
        return findOption;
    }
    searchId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findByPk(userId);
            return user;
        });
    }
    delete(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.destroy({
                where: {
                    id: userId
                }
            });
        });
    }
    createAdmin(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                // userデータ
                const newUser = yield this.model.create(Object.assign(Object.assign({}, hashPassword(data.password)), { role: data.role, name: data.name, phone: data.phone, email: data.email, status: common_1.types.user.Status.ACTIVE }), { transaction });
                yield transaction.commit();
                return {
                    id: newUser.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.db.sequelize.transaction();
            try {
                // userデータ
                const user = yield this.model.findOne({ where: { email: data.email } });
                if (user) {
                    throw new common_1.errors.Argument('email', common_1.messages.errorIsExist('email'));
                }
                const newUser = yield this.model.create(Object.assign(Object.assign({}, hashPassword(data.password)), { role: common_1.types.user.Role.USER, name: data.name, phone: data.phone, email: data.email, status: common_1.types.user.Status.ACTIVE }), { transaction });
                yield transaction.commit();
                return {
                    id: newUser.id
                };
            }
            catch (error) {
                yield transaction.rollback();
                throw error;
            }
        });
    }
}
exports.default = UserRepository;
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
//# sourceMappingURL=user.js.map