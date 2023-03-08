import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.BIGINT.UNSIGNED
      },
      title_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      description_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      title_en: {
        type: dataTypes.TEXT()
      },
      description_en: {
        type: dataTypes.TEXT()
      },
      createdAt: {
        allowNull: false,
        type: dataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: dataTypes.DATE,
        defaultValue: literal('CURRENT_TIMESTAMP')
      },
      deletedAt: {
        type: dataTypes.DATE,
        defaultValue: null
      }
    }),
  down: (qi: QueryInterface) => qi.dropTable('categories')
};
