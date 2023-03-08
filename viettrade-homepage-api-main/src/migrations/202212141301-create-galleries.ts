import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('galleries', {
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
        type: dataTypes.STRING(255)
      },
      feature_video: {
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
  down: (qi: QueryInterface) => qi.dropTable('galleries')
};
