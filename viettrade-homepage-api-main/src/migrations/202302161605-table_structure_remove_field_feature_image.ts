import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface) => {
    return Promise.all([qi.removeColumn('structures', 'feature_image')]);
  },
  down: (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('structures', 'feature_image', {
        type: dataTypes.STRING(255)
      })
    ]);
  }
};
