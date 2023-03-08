import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Project extends Sequelize.Model implements types.project.Attr {
  public readonly id: number;
  public title_vi: string;
  public content_vi: string;
  public description_vi: string;
  public title_en: string;
  public content_en: string;
  public description_en: string;
  public feature_image: string;
  public feature_document: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Project.init(
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
      content_en: {
        type: dt.TEXT()
      },
      feature_image: {
        type: dt.STRING(255)
      },
      feature_document: {
        type: dt.STRING(255)
      },

      ...commonFields(dt)
    },
    {
      sequelize,
      tableName: 'projects'
    }
  );

  return Project;
};
