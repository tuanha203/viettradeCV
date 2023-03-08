import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('departments', 'phone', {
        type: dataTypes.STRING()
      }),
      qi.addColumn('departments', 'email', {
        type: dataTypes.STRING()
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('departments', 'phone'),
      qi.removeColumn('departments', 'email')
    ]);
  }
};
