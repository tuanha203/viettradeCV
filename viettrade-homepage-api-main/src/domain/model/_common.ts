import { DataTypes, literal } from 'sequelize';

export const commonFields = (dt: typeof DataTypes) => ({
  createdAt: {
    allowNull: false,
    type: dt.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  updatedAt: {
    allowNull: false,
    type: dt.DATE,
    defaultValue: literal('CURRENT_TIMESTAMP')
  },
  deletedAt: {
    type: dt.DATE,
    defaultValue: null
  }
});
