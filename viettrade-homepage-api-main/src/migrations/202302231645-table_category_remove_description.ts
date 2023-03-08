import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('categories', 'description_vi'),
      qi.removeColumn('categories', 'description_en')
    ]);
  },
  down: (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('categories', 'description_vi', {
        type: dataTypes.TEXT()
      }),
      qi.addColumn('categories', 'description_en', {
        type: dataTypes.TEXT()
      })
    ]);
  }
};
