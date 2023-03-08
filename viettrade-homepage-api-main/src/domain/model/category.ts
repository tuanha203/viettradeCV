import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';
import { Post } from './post';

export class Category extends Sequelize.Model implements types.category.Attr {
  public readonly id: number;
  public title_vi: string;
  public title_en: string;
  public feature_image: string;
  public display: number;
  public Posts: Post[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {
    Category.hasMany(Post, { foreignKey: 'category_id' });
  }
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Category.init(
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
        type: dt.TEXT()
      },
      display: {
        type: dt.INTEGER()
      },

      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (category) => {
          return sequelize
            .query(`UPDATE categories SET display = display + 1;`)
            .then(() => {
              category.display = 1;
            });
        },
        afterUpdate: async (category: any) => {
          if (
            category.dataValues.display !== category._previousDataValues.display
          ) {
            if (
              category._previousDataValues.display < category.dataValues.display
            ) {
              sequelize.query(
                `UPDATE categories SET display = display - 1 WHERE display <= ${category.dataValues.display} AND display > ${category._previousDataValues.display} AND NOT id = ${category.dataValues.id}`
              );
            } else {
              sequelize.query(
                `UPDATE categories SET display = display + 1 WHERE display >= ${category.dataValues.display} AND display < ${category._previousDataValues.display} AND NOT id = ${category.dataValues.id}`
              );
            }
          }
        },
        beforeDestroy: async (category) => {
          return sequelize
            .query(
              `UPDATE categories SET display = display - 1 WHERE display > ${category.display}`
            )
            .then();
        }
      },
      sequelize,
      tableName: 'categories'
    }
  );

  return Category;
};
