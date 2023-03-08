import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('companies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.BIGINT.UNSIGNED
      },
      name_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      description_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      name_en: {
        type: dataTypes.TEXT()
      },
      description_en: {
        type: dataTypes.TEXT()
      },
      feature_image: {
        type: dataTypes.STRING(255)
      },
      link: {
        type: dataTypes.STRING(255)
      },
      display: {
        allowNull: false,
        type: dataTypes.INTEGER()
      },
      connective: {
        allowNull: false,
        type: dataTypes.TINYINT(),
        defaultValue: 0
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
  down: (qi: QueryInterface) => qi.dropTable('companies')
};
