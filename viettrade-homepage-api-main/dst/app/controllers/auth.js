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
const mapper = require("../mapper/auth");
const mail = require("../utils/mail");
const _base_1 = require("./_base");
/**
 * Authentication Controller
 * contains all function to deal with authentication process
 */
class AuthController extends _base_1.default {
    constructor(db) {
        super(db);
        this.expiresIn = process.env.JWT_EXPIRATION || '3600s'; // default to 60 minutes
        this.jwtSecret = process.env.JWT_SECRET || 'viettrade';
        this.refreshTokenMaxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE || '30'); // default to 30 days
        this.login = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepo.login({
                email: req.body.email,
                password: req.body.password
            });
            if (!(user.success === false)) {
                user = JSON.parse(JSON.stringify(user));
                const token = yield this.signToken(user);
                const refreshToken = yield this.refreshTokenRepo.create(user.id);
                res.setHeader('X-Token-Expiration', this.refreshTokenMaxAge);
                res.json(Object.assign(Object.assign({}, user), { token,
                    refreshToken }));
                const extend = {
                    apiNm: 'login',
                    params: {
                        email: user.email
                    }
                };
                req.user = user;
                this.logClientInfo(req, extend);
            }
            else {
                res.json(user);
            }
        });
        this.logout = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            this.logClientInfo(req);
            this.noContent(res);
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
        this.sendEmail = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const formData = mapper.contactFormData(req);
            yield mail.sendMail(formData.email, formData.title, `<!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Liên hệ</title>
            <meta name="description" content="Liên hệ">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                  <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                    <img width="500" src="https://viettrade.cssdemoco.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftop-logo.ac30ac39.png&w=1080&q=75" title="logo" alt="logo">
                                  </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">${formData.title}</h1>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">${formData.content}</p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <span style="color:#71aded; font-size:15px;line-height:24px; margin:5px;">Người gửi: ${formData.fullName}</span>
                                                <span style="color:#71aded; font-size:15px;line-height:24px; margin:5px;">Số điện thoại: ${formData.phone}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>https://viettrade.cssdemoco.com/</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        </html>`);
            res.json({ success: true });
        });
        this.forgotPassword = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.forgotPassword({
                email: req.body.email
            });
            if (result.success === false) {
                return res.json(result);
            }
            const user = result.user;
            if (user) {
                yield mail.sendMail(user === null || user === void 0 ? void 0 : user.email, 'Tạo mật khẩu mới', `
        <!doctype html>
        <html lang="en-US">
        
        <head>
            <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
            <title>Reset Password Email Template</title>
            <meta name="description" content="Reset Password Email Template.">
            <style type="text/css">
                a:hover {text-decoration: underline !important;}
            </style>
        </head>
        
        <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
            <!--100% body table-->
            <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                    <td>
                        <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                            align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                  <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                    <img width="500" src="https://viettrade.cssdemoco.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftop-logo.ac30ac39.png&w=1080&q=75" title="logo" alt="logo">
                                  </a>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td>
                                    <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                        style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td style="padding:0 35px;">
                                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Bạn đã yêu cầu đặt lại mật khẩu của mình</h1>
                                                <span
                                                    style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Chúng tôi không thể chỉ gửi cho bạn mật khẩu cũ của bạn. Một liên kết duy nhất để đặt lại mật khẩu của bạn đã được tạo cho bạn. Để đặt lại mật khẩu của bạn, hãy nhấp vào liên kết sau và làm theo hướng dẫn. </p>
                                                <a href="${(process.env
                    .HOMEPAGE_URL ||
                    'https://viettrade.cssdemoco.com/') +
                    'set-password/' +
                    result.resetToken}"
                                                    style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Đặt lại mật khẩu</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="height:40px;">&nbsp;</td>
                                        </tr>
                                    </table>
                                </td>
                            <tr>
                                <td style="height:20px;">&nbsp;</td>
                            </tr>
                            <tr>
                                <td style="text-align:center;">
                                    <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>https://viettrade.cssdemoco.com/</strong></p>
                                </td>
                            </tr>
                            <tr>
                                <td style="height:80px;">&nbsp;</td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
            <!--/100% body table-->
        </body>
        </html>`);
            }
            return res.status(200).json({
                success: true,
                message: 'Password reset link sent',
                resetToken: result.resetToken
            });
        });
        this.resetPassword = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.resetPassword(req.body.password, req.body.token);
            if (result.success) {
                return res.json(result);
            }
            return res.json(result);
        });
        this.refresh = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.body.refreshToken;
            const checkTokenResult = yield this.refreshTokenRepo.checkRefreshToken(refreshToken);
            if (!checkTokenResult) {
                res.json({ success: false });
            }
            else {
                const userInfo = yield this.userRepo.getUserInfo(checkTokenResult.userId);
                if (!userInfo) {
                    res.json({ success: false });
                }
                else {
                    const token = yield this.signToken(userInfo);
                    res.json({
                        success: true,
                        accessToken: token.accessToken
                    });
                }
            }
        });
        this.checkToken = (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepo.checkToken(req.body.token);
            if (result.success) {
                return res.json(result);
            }
            return res.json(result);
        });
        this.userRepo = new domain_1.repository.Auth(this.db);
        this.refreshTokenRepo = new domain_1.repository.RefreshToken(this.db);
        // bind to error catcher
        this.login = this.nextWrapper(this.login);
        this.logout = this.nextWrapper(this.logout);
        this.sendEmail = this.nextWrapper(this.sendEmail);
        this.refresh = this.nextWrapper(this.refresh);
    }
}
exports.default = AuthController;
//# sourceMappingURL=auth.js.map