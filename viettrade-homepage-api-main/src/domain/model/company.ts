import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Company extends Sequelize.Model implements types.company.Attr {
  public readonly id: number;
  public name_vi: string;
  public description_vi: string;
  public name_en: string;
  public description_en: string;
  public feature_image: string;
  public link: string;
  public display: number;
  public connective: types.company.Connective;
  public phone: string;
  public address: string;
  public status?: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Company.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      name_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      description_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      name_en: {
        type: dt.TEXT()
      },
      description_en: {
        type: dt.TEXT()
      },
      feature_image: {
        type: dt.STRING(100)
      },
      link: {
        type: dt.STRING(255)
      },
      display: {
        allowNull: false,
        type: dt.INTEGER()
      },
      connective: {
        type: dt.INTEGER()
      },
      phone: {
        type: dt.STRING(255)
      },
      address: {
        type: dt.STRING(255)
      },
      status: {
        type: dt.TINYINT.UNSIGNED
      },
      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (company) => {
          return sequelize
            .query(`UPDATE companies SET display = display + 1;`)
            .then(() => {
              company.display = 1;
            });
        },
        afterUpdate: async (company: any) => {
          if (
            company.dataValues.display !== company._previousDataValues.display
          ) {
            if (
              company._previousDataValues.display < company.dataValues.display
            ) {
              sequelize.query(
                `UPDATE companies SET display = display - 1 WHERE display <= ${company.dataValues.display} AND display > ${company._previousDataValues.display} AND NOT id = ${company.dataValues.id}`
              );
            } else {
              sequelize.query(
                `UPDATE companies SET display = display + 1 WHERE display >= ${company.dataValues.display} AND display < ${company._previousDataValues.display} AND NOT id = ${company.dataValues.id}`
              );
            }
          }
        },
        beforeDestroy: async (company) => {
          return sequelize
            .query(
              `UPDATE companies SET display = display - 1 WHERE display > ${company.display}`
            )
            .then();
        }
      },
      sequelize,
      tableName: 'companies'
    }
  );

  return Company;
};
