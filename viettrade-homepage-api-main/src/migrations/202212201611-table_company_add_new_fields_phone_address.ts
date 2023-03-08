import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('companies', 'phone', {
        type: dataTypes.STRING(255),
        allowNull: false
      }),
      qi.addColumn('companies', 'address', {
        type: dataTypes.STRING(255),
        allowNull: false
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('companies', 'phone'),
      qi.removeColumn('companies', 'address')
    ]);
  }
};
