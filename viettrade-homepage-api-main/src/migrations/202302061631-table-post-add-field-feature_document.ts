import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('posts', 'feature_document', {
        type: dataTypes.STRING(255)
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([qi.removeColumn('posts', 'feature_document')]);
  }
};
