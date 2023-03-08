import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('galleries', 'description_vi'),
      qi.removeColumn('galleries', 'description_en'),
      qi.removeColumn('galleries', 'feature_image')
    ]);
  },
  down: (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('galleries', 'description_vi', {
        allowNull: false,
        type: dataTypes.TEXT()
      }),
      qi.addColumn('galleries', 'description_en', {
        allowNull: false,
        type: dataTypes.TEXT()
      }),
      qi.addColumn('galleries', 'feature_image', {
        allowNull: false,
        type: dataTypes.STRING(255)
      })
    ]);
  }
};
