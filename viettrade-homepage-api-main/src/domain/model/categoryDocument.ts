import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';
import { Document } from './document';

export class CategoryDocument extends Sequelize.Model
  implements types.categoryDocument.Attr {
  public readonly id: number;
  public category_id: number;
  public title_vi: string;
  public title_en: string;
  public Documents: Document[];
  public children: CategoryDocument[];

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {
    CategoryDocument.hasMany(Document, { foreignKey: 'category_id' });
    CategoryDocument.belongsTo(CategoryDocument, {
      as: 'parent',
      foreignKey: 'category_id'
    });

    CategoryDocument.hasMany(CategoryDocument, {
      as: 'children',
      foreignKey: 'category_id'
    });
  }
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  CategoryDocument.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      category_id: {
        allowNull: false,
        type: dt.BIGINT.UNSIGNED
      },
      title_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      title_en: {
        type: dt.TEXT()
      },

      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'categories_documents'
    }
  );

  return CategoryDocument;
};
