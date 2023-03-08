import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('structures', 'level', {
        type: dataTypes.INTEGER()
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([qi.removeColumn('structures', 'level')]);
  }
};
