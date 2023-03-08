import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class User extends Sequelize.Model implements types.user.Attr {
  public readonly id: number;
  public role: types.user.Role;
  public name: string;
  public email: string;
  public password: string;
  public salt: string;
  public status: types.user.Status;
  public emailConfirmedAt?: Date;
  public lastLoginAt?: Date;
  public resetToken?: string | null;
  public resetExpiration?: number | null;
  public phone: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      role: {
        allowNull: false,
        type: dt.TINYINT.UNSIGNED
      },
      name: {
        allowNull: false,
        type: dt.STRING(20)
      },
      email: {
        allowNull: false,
        type: dt.STRING(50),
        unique: true
      },
      password: {
        allowNull: false,
        type: dt.STRING(255)
      },
      salt: {
        allowNull: false,
        type: dt.STRING(10)
      },
      status: {
        allowNull: false,
        type: dt.TINYINT.UNSIGNED
      },
      emailConfirmedAt: {
        type: dt.DATE
      },
      lastLoginAt: {
        type: dt.DATE
      },
      resetToken: {
        type: dt.STRING()
      },
      resetExpiration: {
        type: dt.NUMBER()
      },
      phone: {
        type: dt.STRING
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'user',
      name: { singular: 'user', plural: 'user' }
    }
  );

  return User;
};
