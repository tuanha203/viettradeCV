import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('publications', {
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
      content_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      title_en: {
        type: dataTypes.TEXT()
      },
      content_en: {
        type: dataTypes.TEXT()
      },
      feature_image: {
        type: dataTypes.STRING(100)
      },
      link: {
        type: dataTypes.STRING(255)
      },
      display: {
        allowNull: false,
        type: dataTypes.INTEGER()
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
  down: (qi: QueryInterface) => qi.dropTable('publications')
};
