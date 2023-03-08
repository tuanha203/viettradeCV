import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('structures', 'display', {
      type: dataTypes.INTEGER
    }),

  down: (qi: QueryInterface) => qi.removeColumn('structures', 'display')
};
