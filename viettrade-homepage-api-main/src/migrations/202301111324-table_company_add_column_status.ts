import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('companies', 'status', {
      allowNull: false,
      type: dataTypes.TINYINT.UNSIGNED,
      defaultValue: 0
    }),

  down: (qi: QueryInterface) => qi.removeColumn('companies', 'status')
};
