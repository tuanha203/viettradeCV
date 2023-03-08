import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('user', 'name', {
        type: dataTypes.STRING(191),
        allowNull: false
      })
    ]);
  },
  down: (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('user', 'name', {
        type: dataTypes.STRING(20),
        allowNull: false
      })
    ]);
  }
};
