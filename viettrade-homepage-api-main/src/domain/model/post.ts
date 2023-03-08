import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';
import { Category } from './category';

export class Post extends Sequelize.Model implements types.post.Attr {
  public readonly id: number;
  public readonly category_id: number;
  public title_vi: string;
  public content_vi: string;
  public description_vi: string;
  public title_en: string;
  public content_en: string;
  public description_en: string;
  public feature_image: string;
  public view_count: number;
  public category: Category;
  public publish?: types.post.Publish;
  public publish_at?: Date;
  public status?: string;
  public feature_document: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {
    Post.belongsTo(Category, { foreignKey: 'category_id' });
  }
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Post.init(
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
      content_vi: {
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
      content_en: {
        type: dt.TEXT()
      },
      description_en: {
        allowNull: false,
        type: dt.TEXT()
      },
      feature_image: {
        type: dt.TEXT()
      },
      feature_document: {
        type: dt.TEXT()
      },
      view_count: {
        type: dt.INTEGER
      },
      publish: {
        type: dt.TINYINT.UNSIGNED
      },
      status: {
        type: dt.TINYINT.UNSIGNED
      },
      publish_at: {
        type: dt.DATE
      },

      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'posts'
    }
  );

  return Post;
};
