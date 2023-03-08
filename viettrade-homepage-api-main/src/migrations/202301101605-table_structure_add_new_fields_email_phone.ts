import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('structures', 'phone', {
        defaultValue: 0,
        type: dataTypes.STRING()
      }),
      qi.addColumn('structures', 'email', {
        defaultValue: 0,
        type: dataTypes.STRING(50)
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('structures', 'phone'),
      qi.removeColumn('structures', 'email')
    ]);
  }
};
