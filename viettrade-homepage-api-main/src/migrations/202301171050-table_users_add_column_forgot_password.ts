import { DataTypes, QueryInterface } from 'sequelize';

export default {
  up: async (qi: QueryInterface, dataTypes: typeof DataTypes) => {
    return Promise.all([
      qi.addColumn('user', 'resetToken', {
        type: dataTypes.STRING()
      }),
      qi.addColumn('user', 'resetExpiration', {
        type: dataTypes.BIGINT()
      })
    ]);
  },
  down: (qi: QueryInterface) => {
    return Promise.all([
      qi.removeColumn('user', 'resetToken'),
      qi.removeColumn('user', 'resetExpiration')
    ]);
  }
};
