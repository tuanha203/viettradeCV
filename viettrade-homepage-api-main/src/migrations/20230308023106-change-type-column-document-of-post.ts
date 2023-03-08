import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('posts', 'feature_document', {
        type: dataTypes.TEXT()
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([qi.removeColumn('posts', 'feature_document')]);
  }
};
