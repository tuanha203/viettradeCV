import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('structures', 'address', {
      type: dataTypes.STRING()
    }),

  down: (qi: QueryInterface) => qi.removeColumn('structures', 'address')
};
