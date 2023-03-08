import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('galleries', 'description_vi', {
        type: dataTypes.TEXT(),
        allowNull: true
      }),
      qi.addColumn('galleries', 'description_en', {
        type: dataTypes.TEXT(),
        allowNull: true
      }),
      qi.addColumn('publications', 'description_vi', {
        type: dataTypes.TEXT(),
        allowNull: true
      }),
      qi.addColumn('publications', 'description_en', {
        type: dataTypes.TEXT(),
        allowNull: true
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('galleries', 'description_vi'),
      qi.removeColumn('galleries', 'description_en'),
      qi.removeColumn('publications', 'description_vi'),
      qi.removeColumn('publications', 'description_en')
    ]);
  }
};
