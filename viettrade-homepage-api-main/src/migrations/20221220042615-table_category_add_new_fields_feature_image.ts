import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) =>
    qi.addColumn('categories', 'feature_image', {
      type: dataTypes.STRING(255)
    }),

  down: (qi: QueryInterface) => qi.removeColumn('categories', 'feature_image')
};
