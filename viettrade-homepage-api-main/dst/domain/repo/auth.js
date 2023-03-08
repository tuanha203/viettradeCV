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
const crypto = require("crypto");
const sequelize_1 = require("sequelize");
const common_1 = require("../../common");
const _base_1 = require("./_base");
/**
 * repository which in charge of authentication process
 */
class AuthRepository extends _base_1.default {
    constructor(db) {
        super(db);
        this.model = db.User;
    }
    login(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield this.model.findOne({
                where: {
                    email: params.email
                }
            });
            if (userInfo !== null) {
                // [userM].[status] = 1:INACTIVE
                if (userInfo.status === common_1.types.user.Status.INACTIVE) {
                    return { success: false, messages: [common_1.messages.inActive] };
                    // throw new errors.Argument('passwordError', messages.passwordError);
                }
                if ([
                    common_1.types.user.Role.ADMIN,
                    common_1.types.user.Role.CONTENT,
                    common_1.types.user.Role.USER
                ].indexOf(userInfo.role) === -1) {
                    // throw new errors.Argument(
                    //   'dataMismatchingError',
                    //   messages.dataMismatchingError
                    // );
                    return { success: false, messages: [common_1.messages.dataMismatchingError] };
                }
            }
            else {
                // email not found in db, return error
                // throw new errors.Argument('email, password', messages.passwordError);
                return { success: false, messages: [common_1.messages.passwordError] };
            }
            // got user with matched email
            // calculate the hash password
            const hashedPassword = crypto
                .createHmac('sha256', userInfo.salt)
                .update(params.password)
                .digest('hex');
            if (hashedPassword !== userInfo.password) {
                // password not match, return error
                return { success: false, messages: [common_1.messages.passwordError] };
                // throw new errors.Argument('email, password', messages.passwordError);
            }
            userInfo.set('lastLoginAt', new Date());
            yield userInfo.save();
            return userInfo;
        });
    }
    forgotPassword(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({ where: { email: params.email } });
            if (!user) {
                return { success: false, message: 'User not found' };
            }
            const resetToken = crypto.randomBytes(16).toString('hex');
            const resetExpiration = Date.now() + Number(process.env.TIMELIFE_TOKEN_RESET_PASSWORD || 600000);
            user.resetToken = resetToken;
            user.resetExpiration = resetExpiration;
            yield user.save();
            return { success: true, user: user, resetToken: resetToken };
        });
    }
    resetPassword(password, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            resetToken: token
                        },
                        {
                            resetExpiration: { [sequelize_1.Op.gt]: Date.now() }
                        }
                    ]
                }
            });
            if (!user) {
                return {
                    status: 404,
                    success: false,
                    message: 'Invalid token or token expired'
                };
            }
            user.salt = Math.random()
                .toString(36)
                .substring(2)
                .substring(0, 10);
            user.password = crypto
                .createHmac('sha256', user.salt)
                .update(password)
                .digest('hex');
            user.resetToken = null;
            user.resetExpiration = null;
            yield user.save();
            return { success: true, status: 200, message: 'Update successful' };
        });
    }
    checkToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.model.findOne({
                where: {
                    [sequelize_1.Op.and]: [
                        {
                            status: common_1.types.user.Status.ACTIVE
                        },
                        {
                            resetToken: token
                        },
                        {
                            resetExpiration: { [sequelize_1.Op.gt]: Date.now() }
                        }
                    ]
                }
            });
            if (!user) {
                return {
                    status: 404,
                    success: false
                };
            }
            return { success: true, status: 200 };
        });
    }
    getUserInfo(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOne({
                where: {
                    id
                },
                raw: true
            });
        });
    }
}
exports.default = AuthRepository;
//# sourceMappingURL=auth.js.map