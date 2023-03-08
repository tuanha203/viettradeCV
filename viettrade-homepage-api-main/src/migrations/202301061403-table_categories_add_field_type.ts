import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('categories', 'type', {
      defaultValue: 0,
      type: dataTypes.INTEGER()
    }),

  down: (qi: QueryInterface) => qi.removeColumn('categories', 'type')
};
