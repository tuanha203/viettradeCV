import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('posts', 'status', {
      allowNull: true,
      type: dataTypes.TINYINT.UNSIGNED,
      defaultValue: 0
    }),

  down: (qi: QueryInterface) => qi.removeColumn('posts', 'status')
};
