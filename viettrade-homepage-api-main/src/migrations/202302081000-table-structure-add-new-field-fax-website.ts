import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('structures', 'fax', {
        type: dataTypes.STRING()
      }),
      qi.addColumn('structures', 'website', {
        type: dataTypes.STRING()
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('structures', 'fax'),
      qi.removeColumn('structures', 'website')
    ]);
  }
};
