import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.removeColumn('publications', 'link'),
      qi.addColumn('publications', 'pdf_file', {
        type: dataTypes.STRING(255)
      })
    ]);
  },
  down: (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('publications', 'link', {
        type: dataTypes.STRING(255)
      }),
      qi.removeColumn('publications', 'pdf_file')
    ]);
  }
};
