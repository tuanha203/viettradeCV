import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('structures', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.BIGINT.UNSIGNED
      },
      parent_id: {
        allowNull: true,
        type: dataTypes.BIGINT.UNSIGNED,
        defaultValue: 0
      },
      full_name: {
        allowNull: false,
        type: dataTypes.STRING(50)
      },
      position_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      position_en: {
        type: dataTypes.TEXT()
      },
      feature_image: {
        type: dataTypes.STRING(255)
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
  down: (qi: QueryInterface) => qi.dropTable('structures')
};
