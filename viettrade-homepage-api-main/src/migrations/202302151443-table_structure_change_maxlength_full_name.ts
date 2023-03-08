import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('structures', 'full_name', {
        type: dataTypes.STRING(255),
        allowNull: false
      })
    ]);
  },
  down: (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.changeColumn('structures', 'full_name', {
        type: dataTypes.STRING(50),
        allowNull: false
      })
    ]);
  }
};
