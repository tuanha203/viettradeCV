import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { repository } from '../../domain';
import * as mapper from '../mapper/auth';
import * as mail from '../utils/mail';
import BaseController from './_base';

/**
 * Authentication Controller
 * contains all function to deal with authentication process
 */
class AuthController extends BaseController {
  private readonly userRepo: repository.Auth;
  private readonly refreshTokenRepo: repository.RefreshToken;
  private readonly expiresIn: string = process.env.JWT_EXPIRATION || '3600s'; // default to 60 minutes
  private readonly jwtSecret: string = process.env.JWT_SECRET || 'viettrade';
  private readonly refreshTokenMaxAge: number = Number(
    process.env.REFRESH_TOKEN_MAX_AGE || '30'
  ); // default to 30 days

  constructor(db: SQLize) {
    super(db);

    this.userRepo = new repository.Auth(this.db);
    this.refreshTokenRepo = new repository.RefreshToken(this.db);

    // bind to error catcher
    this.login = this.nextWrapper(this.login);
    this.logout = this.nextWrapper(this.logout);
    this.sendEmail = this.nextWrapper(this.sendEmail);
    this.refresh = this.nextWrapper(this.refresh);
  }

  public login = async (req: Request, res: Response, _next: NextFunction) => {
    let user: any = await this.userRepo.login({
      email: req.body.email,
      password: req.body.password
    });
    if (!(user.success === false)) {
      user = JSON.parse(JSON.stringify(user));
      const token = await this.signToken(user);
      const refreshToken = await this.refreshTokenRepo.create(user.id);
      res.setHeader('X-Token-Expiration', this.refreshTokenMaxAge);
      res.json({
        ...user,
        token,
        refreshToken
      });

      const extend: any = {
        apiNm: 'login',
        params: {
          email: user.email
        }
      };

      req.user = <any>user;
      this.logClientInfo(req, extend);
    } else {
      res.json(user);
    }
  };

  public logout = async (req: Request, res: Response, _next: NextFunction) => {
    this.logClientInfo(req);
    this.noContent(res);
  };

  private signToken = async (data: { id: number }) => {
    const token = jwt.sign(data, this.jwtSecret, {
      expiresIn: this.expiresIn
    });
    const result = {
      accessToken: token
    };

    return result;
  };

  sendEmail = async (req: Request, res: Response, _next: NextFunction) => {
    const formData = mapper.contactFormData(req);
    await mail.sendMail(
      formData.email,
      formData.title,
      `<!doctype html>
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
        </html>`
    );
    res.json({ success: true });
  };

  public forgotPassword = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.userRepo.forgotPassword({
      email: req.body.email
    });
    if (result.success === false) {
      return res.json(result);
    }
    const user = result.user;
    if (user) {
      await mail.sendMail(
        user?.email,
        'Tạo mật khẩu mới',
        `
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
        </html>`
      );
    }
    return res.status(200).json({
      success: true,
      message: 'Password reset link sent',
      resetToken: result.resetToken
    });
  };

  public resetPassword = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.userRepo.resetPassword(
      req.body.password,
      req.body.token
    );
    if (result.success) {
      return res.json(result);
    }
    return res.json(result);
  };

  public refresh = async (req: Request, res: Response, _next: NextFunction) => {
    const refreshToken = req.body.refreshToken;
    const checkTokenResult = await this.refreshTokenRepo.checkRefreshToken(
      refreshToken
    );
    if (!checkTokenResult) {
      res.json({ success: false });
    } else {
      const userInfo = await this.userRepo.getUserInfo(checkTokenResult.userId);
      if (!userInfo) {
        res.json({ success: false });
      } else {
        const token = await this.signToken(userInfo);
        res.json({
          success: true,
          accessToken: token.accessToken
        });
      }
    }
  };

  public checkToken = async (
    req: Request,
    res: Response,
    _next: NextFunction
  ) => {
    const result = await this.userRepo.checkToken(req.body.token);
    if (result.success) {
      return res.json(result);
    }
    return res.json(result);
  };
}

export default AuthController;
