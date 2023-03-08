import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Admin extends Sequelize.Model implements types.admin.Attr {
  public readonly id: number;
  public role: types.admin.Role;
  public name: string;
  public email: string;
  public password: string;
  public salt: string;
  public status: types.admin.Status;
  public emailConfirmedAt?: Date;
  public lastLoginAt?: Date;
  public feature_image: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Admin.init(
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
      feature_image: {
        type: dt.STRING,
        allowNull: true
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'admin',
      name: { singular: 'admin', plural: 'admin' }
    }
  );

  return Admin;
};
