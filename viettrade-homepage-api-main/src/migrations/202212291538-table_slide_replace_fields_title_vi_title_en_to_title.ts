import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.removeColumn('slides', 'title_vi'),
      qi.removeColumn('slides', 'title_en'),
      qi.addColumn('slides', 'title', {
        allowNull: false,
        type: dataTypes.TEXT()
      })
    ]);
  },
  down: (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('slides', 'title_vi', {
        allowNull: false,
        type: dataTypes.TEXT()
      }),
      qi.addColumn('slides', 'title_en', {
        allowNull: false,
        type: dataTypes.TEXT()
      }),
      qi.removeColumn('slides', 'title')
    ]);
  }
};
