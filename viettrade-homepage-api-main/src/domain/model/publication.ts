import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Publication extends Sequelize.Model
  implements types.publication.Attr {
  public readonly id: number;
  public title_vi: string;
  public description_vi: string;
  public content_vi: string;
  public title_en: string;
  public description_en: string;
  public content_en: string;
  public feature_image: string;
  public pdf_file: string;
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
  Publication.init(
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
      description_vi: {
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
      description_en: {
        type: dt.TEXT()
      },
      content_en: {
        type: dt.TEXT()
      },
      feature_image: {
        type: dt.TEXT()
      },
      pdf_file: {
        type: dt.TEXT()
      },
      display: {
        type: dt.INTEGER
      },

      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (publication) => {
          return sequelize
            .query(`UPDATE publications SET display = display + 1;`)
            .then(() => {
              publication.display = 1;
            });
        },
        afterUpdate: async (publication: any) => {
          if (
            publication.dataValues.display !==
            publication._previousDataValues.display
          ) {
            if (
              publication._previousDataValues.display <
              publication.dataValues.display
            ) {
              sequelize.query(
                `UPDATE publications SET display = display - 1 WHERE display <= ${publication.dataValues.display} AND display > ${publication._previousDataValues.display} AND NOT id = ${publication.dataValues.id}`
              );
            } else {
              sequelize.query(
                `UPDATE publications SET display = display + 1 WHERE display >= ${publication.dataValues.display} AND display < ${publication._previousDataValues.display} AND NOT id = ${publication.dataValues.id}`
              );
            }
          }
        },
        beforeDestroy: async (publication) => {
          return sequelize
            .query(
              `UPDATE publications SET display = display - 1 WHERE display > ${publication.display}`
            )
            .then();
        }
      },
      sequelize,
      tableName: 'publications'
    }
  );

  return Publication;
};
