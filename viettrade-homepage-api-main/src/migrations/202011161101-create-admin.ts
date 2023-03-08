import { DataTypes, literal, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.createTable('admin', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dataTypes.BIGINT.UNSIGNED
      },
      role: {
        allowNull: false,
        type: dataTypes.TINYINT.UNSIGNED
      },
      name: {
        allowNull: false,
        type: dataTypes.STRING(50)
      },
      email: {
        allowNull: false,
        type: dataTypes.STRING(50)
      },
      password: {
        allowNull: false,
        type: dataTypes.STRING(255)
      },
      salt: {
        allowNull: false,
        type: dataTypes.STRING(10)
      },
      status: {
        allowNull: false,
        type: dataTypes.TINYINT.UNSIGNED
      },
      emailConfirmedAt: {
        type: dataTypes.DATE
      },
      lastLoginAt: {
        type: dataTypes.DATE
      },
      feature_image: {
        type: dataTypes.STRING
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
        allowNull: true,
        type: dataTypes.DATE,
        defaultValue: null
      }
    }),
  down: (qi: QueryInterface) => qi.dropTable('admin')
};
