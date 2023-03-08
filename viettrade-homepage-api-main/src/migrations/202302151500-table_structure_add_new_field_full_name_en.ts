import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.renameColumn('structures', 'full_name', 'full_name_vi'),
      qi.addColumn('structures', 'full_name_en', {
        type: dataTypes.STRING()
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([
      qi.renameColumn('structures', 'full_name_vi', 'full_name'),
      qi.removeColumn('structures', 'full_name_en')
    ]);
  }
};
