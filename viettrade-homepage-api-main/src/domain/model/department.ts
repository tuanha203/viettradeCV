import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Department extends Sequelize.Model
  implements types.department.Attr {
  public readonly id: number;
  public parent_id: number;
  public full_name: string;
  public position_vi: string;
  public position_en: string;
  public phone: string;
  public email: string;
  public feature_image: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;
  public Departments: Department[];

  public static ASSOCIATE() {
    Department.belongsTo(Department, {
      as: 'parent',
      foreignKey: 'parent_id'
    });
    Department.hasMany(Department, { foreignKey: 'parent_id' });
  }
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Department.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      parent_id: {
        allowNull: true,
        type: dt.BIGINT.UNSIGNED
      },
      full_name: {
        allowNull: false,
        type: dt.TEXT()
      },
      position_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      position_en: {
        allowNull: true,
        type: dt.TEXT()
      },
      phone: {
        allowNull: true,
        type: dt.TEXT()
      },
      email: {
        allowNull: true,
        type: dt.TEXT()
      },
      feature_image: {
        type: dt.TEXT()
      },

      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'departments'
    }
  );

  return Department;
};
