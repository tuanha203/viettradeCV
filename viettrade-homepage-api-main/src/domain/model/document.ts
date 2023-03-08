import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';
import { CategoryDocument } from './categoryDocument';

export class Document extends Sequelize.Model implements types.document.Attr {
  public readonly id: number;
  public readonly category_id: number;
  public title_vi: string;
  public description_vi: string;
  public title_en: string;
  public description_en: string;
  public feature_document: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {
    Document.belongsTo(CategoryDocument, { foreignKey: 'category_id' });
  }
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Document.init(
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
      description_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      title_en: {
        type: dt.TEXT()
      },
      description_en: {
        allowNull: false,
        type: dt.TEXT()
      },
      feature_document: {
        type: dt.TEXT()
      },
      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'documents'
    }
  );

  return Document;
};
