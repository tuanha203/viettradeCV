import * as moment from 'moment';
import { Op } from 'sequelize';
import * as uuid from 'uuid';

import { DB } from '../model';
import BaseRepository from './_base';

export default class RefreshTokenRepository extends BaseRepository {
  public readonly model: DB['RefreshToken'];
  constructor(db: DB) {
    super(db);
    this.model = db.RefreshToken;
  }

  public async create(userId: number) {
    const refreshToken = uuid.v4();
    await this.model.create({
      userId,
      refreshToken,
      expireAt: moment().add(30, 'days')
    });
    this.deleteToken();
    return refreshToken;
  }

  public async checkRefreshToken(token: string) {
    const refreshTokens = await this.model.findAll({
      where: {
        refreshToken: token,
        expireAt: {
          [Op.gt]: new Date()
        }
      }
    });

    if (refreshTokens.length === 0) {
      return undefined;
    }

    return refreshTokens[0];
  }

  public async deleteToken() {
    await this.model.destroy({
      where: {
        expireAt: {
          [Op.lt]: new Date()
        }
      }
    });
  }
}
