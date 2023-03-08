import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Slide extends Sequelize.Model implements types.slide.Attr {
  public readonly id: number;
  public title: string;
  public link: string;
  public display: number;
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
  Slide.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      title: {
        allowNull: false,
        type: dt.TEXT()
      },
      link: {
        allowNull: false,
        type: dt.TEXT()
      },
      display: {
        type: dt.INTEGER
      },
      feature_image: {
        type: dt.TEXT()
      },

      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (slide) => {
          return sequelize
            .query(`UPDATE slides SET display = display + 1;`)
            .then(() => {
              slide.display = 1;
            });
        },
        beforeDestroy: async (slide) => {
          return sequelize
            .query(
              `UPDATE slides SET display = display - 1 WHERE display > ` +
                `${slide.display}` +
                `;`
            )
            .then(() => {});
        }
      },
      sequelize,
      tableName: 'slides'
    }
  );

  return Slide;
};
