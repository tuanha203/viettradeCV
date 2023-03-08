import * as crypto from 'crypto';
import { Op } from 'sequelize';

import { messages, types } from '../../common';
import { DB } from '../model';
import BaseRepository from './_base';

/**
 * repository which in charge of authentication process
 */
export default class AuthRepository extends BaseRepository {
  public readonly model: DB['User'];

  constructor(db: DB) {
    super(db);
    this.model = db.User;
  }

  public async login(params: types.auth.LoginParams) {
    const userInfo = await this.model.findOne({
      where: {
        email: params.email
      }
    });

    if (userInfo !== null) {
      // [userM].[status] = 1:INACTIVE
      if (userInfo.status === types.user.Status.INACTIVE) {
        return { success: false, messages: [messages.inActive] };
        // throw new errors.Argument('passwordError', messages.passwordError);
      }

      if (
        [
          types.user.Role.ADMIN,
          types.user.Role.CONTENT,
          types.user.Role.USER
        ].indexOf(userInfo.role) === -1
      ) {
        // throw new errors.Argument(
        //   'dataMismatchingError',
        //   messages.dataMismatchingError
        // );
        return { success: false, messages: [messages.dataMismatchingError] };
      }
    } else {
      // email not found in db, return error
      // throw new errors.Argument('email, password', messages.passwordError);
      return { success: false, messages: [messages.passwordError] };
    }

    // got user with matched email
    // calculate the hash password
    const hashedPassword = crypto
      .createHmac('sha256', userInfo.salt)
      .update(params.password)
      .digest('hex');

    if (hashedPassword !== userInfo.password) {
      // password not match, return error
      return { success: false, messages: [messages.passwordError] };
      // throw new errors.Argument('email, password', messages.passwordError);
    }
    userInfo.set('lastLoginAt', new Date());
    await userInfo.save();

    return userInfo;
  }

  public async forgotPassword(params: types.auth.ForgotPasswordParams) {
    const user = await this.model.findOne({ where: { email: params.email } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    const resetToken = crypto.randomBytes(16).toString('hex');
    const resetExpiration =
      Date.now() + Number(process.env.TIMELIFE_TOKEN_RESET_PASSWORD || 600000);
    user.resetToken = resetToken;
    user.resetExpiration = resetExpiration;
    await user.save();
    return { success: true, user: user, resetToken: resetToken };
  }

  public async resetPassword(password: string, token: string) {
    const user = await this.model.findOne({
      where: {
        [Op.and]: [
          {
            resetToken: token
          },
          {
            resetExpiration: { [Op.gt]: Date.now() }
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
    await user.save();
    return { success: true, status: 200, message: 'Update successful' };
  }

  public async checkToken(token: string) {
    const user = await this.model.findOne({
      where: {
        [Op.and]: [
          {
            status: types.user.Status.ACTIVE
          },
          {
            resetToken: token
          },
          {
            resetExpiration: { [Op.gt]: Date.now() }
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
  }

  public async getUserInfo(id: number) {
    return await this.model.findOne({
      where: {
        id
      },
      raw: true
    });
  }
}
