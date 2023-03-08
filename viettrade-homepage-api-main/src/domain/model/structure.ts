import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Structure extends Sequelize.Model implements types.structure.Attr {
  public readonly id: number;
  public parent_id?: number;
  public full_name_vi: string;
  public full_name_en?: string;
  public position_vi: string;
  public position_en: string;
  public phone: string;
  public email: string;
  public fax: string;
  public website: string;
  public level: number;
  public address: string;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;
  public Structures: Structure[];

  public static ASSOCIATE() {
    Structure.belongsTo(Structure, {
      as: 'parent',
      foreignKey: 'parent_id'
    });
    Structure.hasMany(Structure, { foreignKey: 'parent_id' });
  }
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Structure.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      parent_id: {
        allowNull: true,
        type: dt.BIGINT.UNSIGNED
      },
      full_name_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      full_name_en: {
        allowNull: true,
        type: dt.TEXT()
      },
      position_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      position_en: {
        allowNull: true,
        type: dt.TEXT()
      },
      phone: {
        allowNull: true,
        type: dt.TEXT()
      },
      email: {
        allowNull: true,
        type: dt.TEXT()
      },
      fax: {
        type: dt.TEXT()
      },
      website: {
        type: dt.TEXT()
      },
      level: {
        type: dt.INTEGER()
      },
      display: {
        type: dt.INTEGER
      },
      address: {
        type: dt.TEXT()
      },

      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (structure) => {
          if (structure.parent_id != 0) {
            return sequelize
              .query(
                `UPDATE structures SET display = display + 1 WHERE parent_id = ` +
                  `${structure.parent_id}` +
                  `;`
              )
              .then(() => {
                structure.display = 1;
              });
          } else {
            return sequelize
              .query(
                `UPDATE structures SET display = display + 1 WHERE parent_id = 0;`
              )
              .then(() => {
                structure.display = 1;
              });
          }
        },
        beforeUpdate: async (structure: any) => {
          if (
            structure.dataValues.parent_id !==
              structure._previousDataValues.parent_id &&
            structure.dataValues.display ===
              structure._previousDataValues.display
          ) {
            sequelize
              .query(
                `UPDATE structures SET display = display + 1 WHERE parent_id = ${structure.dataValues.parent_id} AND NOT id = ${structure.dataValues.id};`
              )
              .then(() => {
                structure.display = 1;
              });
          }
        },
        afterUpdate: async (structure: any) => {
          if (
            structure.dataValues.parent_id !==
              structure._previousDataValues.parent_id &&
            structure.dataValues.display ===
              structure._previousDataValues.display
          ) {
            sequelize.query(
              `UPDATE structures SET display = display - 1 WHERE parent_id = ${structure._previousDataValues.parent_id} AND display > ${structure._previousDataValues.display}`
            );
          }
        },
        beforeDestroy: async (structure) => {
          if (structure.parent_id != 0) {
            return sequelize
              .query(
                `UPDATE structures SET display = display - 1 WHERE display > ` +
                  `${structure.display}` +
                  ` AND parent_id = ` +
                  `${structure.parent_id}` +
                  `;`
              )
              .then(() => {});
          } else {
            return sequelize
              .query(
                `UPDATE structures SET display = display - 1 WHERE parent_id = 0 AND display > ${structure.display}`
              )
              .then(() => {});
          }
        },
        afterDestroy: async (structure) => {
          return sequelize
            .query(
              `DELETE FROM structures WHERE parent_id IN (SELECT id FROM (SELECT id FROM structures st WHERE st.parent_id = ${structure.id}) as ID) OR parent_id = ${structure.id};`
            )
            .then(() => {});
        }
      },
      sequelize,
      tableName: 'structures'
    }
  );

  return Structure;
};
