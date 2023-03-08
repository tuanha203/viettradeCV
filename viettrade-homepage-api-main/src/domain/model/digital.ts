import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Digital extends Sequelize.Model implements types.digital.Attr {
  public readonly id: number;
  public title_vi: string;
  public title_en: string;
  public feature_image: string;
  public feature_icon: string;
  public link: string;
  public display: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Digital.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      title_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      title_en: {
        type: dt.TEXT()
      },
      feature_image: {
        type: dt.STRING(255)
      },
      feature_icon: {
        type: dt.STRING(255)
      },
      link: {
        type: dt.STRING(255)
      },
      display: {
        allowNull: false,
        type: dt.INTEGER()
      },
      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (question) => {
          return sequelize
            .query(`UPDATE digitals SET display = display + 1;`)
            .then(() => {
              question.display = 1;
            });
        },
        afterUpdate: async (question: any) => {
          if (
            question.dataValues.display !== question._previousDataValues.display
          ) {
            if (
              question._previousDataValues.display < question.dataValues.display
            ) {
              sequelize.query(
                `UPDATE digitals SET display = display - 1 WHERE display <= ${question.dataValues.display} AND display > ${question._previousDataValues.display} AND NOT id = ${question.dataValues.id}`
              );
            } else {
              sequelize.query(
                `UPDATE digitals SET display = display + 1 WHERE display >= ${question.dataValues.display} AND display < ${question._previousDataValues.display} AND NOT id = ${question.dataValues.id}`
              );
            }
          }
        },
        beforeDestroy: async (question) => {
          return sequelize
            .query(
              `UPDATE digitals SET display = display - 1 WHERE display > ${question.display}`
            )
            .then();
        }
      },
      sequelize,
      tableName: 'digitals'
    }
  );

  return Digital;
};
