import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('user', 'phone', {
      type: dataTypes.STRING
    }),

  down: (qi: QueryInterface) => qi.removeColumn('user', 'phone')
};
