import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('categories', 'display', {
      type: dataTypes.INTEGER()
    }),

  down: (qi: QueryInterface) => qi.removeColumn('categories', 'display')
};
