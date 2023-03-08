import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Gallery extends Sequelize.Model implements types.gallery.Attr {
  public readonly id: number;
  public title_vi: string;
  public content_vi: string;
  public title_en: string;
  public content_en: string;
  public feature_video: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Gallery.init(
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
      content_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      title_en: {
        type: dt.TEXT()
      },
      content_en: {
        type: dt.TEXT()
      },
      feature_video: {
        type: dt.TEXT()
      },

      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'galleries'
    }
  );

  return Gallery;
};
