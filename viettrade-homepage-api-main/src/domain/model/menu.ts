import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Menu extends Sequelize.Model implements types.menu.Attr {
  public readonly id: number;
  public title_vi: string;
  public title_en: string;
  public link: string;
  public display: number;
  public parent_id: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {
    Menu.belongsTo(Menu, {
      as: 'parent',
      foreignKey: 'parent_id'
    });
    Menu.hasMany(Menu, { foreignKey: 'parent_id' });
  }
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Menu.init(
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
        allowNull: true,
        type: dt.TEXT()
      },
      link: {
        allowNull: true,
        type: dt.TEXT()
      },
      display: {
        type: dt.INTEGER
      },
      parent_id: {
        allowNull: true,
        type: dt.BIGINT.UNSIGNED
      },

      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (menu) => {
          if (menu.parent_id != 0) {
            return sequelize
              .query(
                `UPDATE menus SET display = display + 1 WHERE parent_id = ` +
                  `${menu.parent_id}` +
                  `;`
              )
              .then(() => {
                menu.display = 1;
              });
          } else {
            return sequelize
              .query(
                `UPDATE menus SET display = display + 1 WHERE parent_id = 0;`
              )
              .then(() => {
                menu.display = 1;
              });
          }
        },
        beforeUpdate: async (menu: any) => {
          if (
            menu.dataValues.parent_id !== menu._previousDataValues.parent_id &&
            menu.dataValues.display === menu._previousDataValues.display
          ) {
            sequelize
              .query(
                `UPDATE menus SET display = display + 1 WHERE parent_id = ${menu.dataValues.parent_id} AND NOT id = ${menu.dataValues.id};`
              )
              .then(() => {
                menu.display = 1;
              });
          }
        },
        afterUpdate: async (menu: any) => {
          if (
            menu.dataValues.parent_id !== menu._previousDataValues.parent_id &&
            menu.dataValues.display === menu._previousDataValues.display
          ) {
            sequelize.query(
              `UPDATE menus SET display = display - 1 WHERE parent_id = ${menu._previousDataValues.parent_id} AND display > ${menu._previousDataValues.display}`
            );
          }
        },
        beforeDestroy: async (menu) => {
          if (menu.parent_id != 0) {
            return sequelize
              .query(
                `UPDATE menus SET display = display - 1 WHERE display > ` +
                  `${menu.display}` +
                  ` AND parent_id = ` +
                  `${menu.parent_id}` +
                  `;`
              )
              .then(() => {});
          } else {
            return sequelize
              .query(
                `UPDATE menus SET display = display - 1 WHERE parent_id = 0`
              )
              .then(() => {});
          }
        },
        afterDestroy: async (menu) => {
          return sequelize
            .query(`DELETE FROM menus WHERE parent_id = ` + `${menu.id}` + `;`)
            .then(() => {});
        }
      },
      sequelize,
      tableName: 'menus'
    }
  );

  return Menu;
};
