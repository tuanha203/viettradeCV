import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.BIGINT.UNSIGNED
      },
      question_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      answer_vi: {
        allowNull: false,
        type: dataTypes.TEXT()
      },
      question_en: {
        type: dataTypes.TEXT()
      },
      answern_en: {
        type: dataTypes.TEXT()
      },
      feature_document: {
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
  down: (qi: QueryInterface) => qi.dropTable('questions')
};
