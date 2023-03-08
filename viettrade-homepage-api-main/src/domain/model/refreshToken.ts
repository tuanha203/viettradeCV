import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class RefreshToken extends Sequelize.Model
  implements types.refreshToken.Attr {
  public readonly id: number;
  public userId: number;
  public refreshToken: string;
  public expireAt: Date;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  RefreshToken.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      userId: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      refreshToken: {
        allowNull: false,
        type: dt.STRING(255)
      },
      expireAt: {
        allowNull: false,
        type: dt.DATE
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'refreshTokens'
    }
  );

  return RefreshToken;
};
