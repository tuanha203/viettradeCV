import * as Sequelize from 'sequelize';

import { types } from '../../common';
import { commonFields } from './_common';

export class Question extends Sequelize.Model implements types.question.Attr {
  public readonly id: number;
  public question_vi: string;
  public answer_vi: string;
  public question_en: string;
  public answern_en: string;
  public display: number;

  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date;

  public static ASSOCIATE() {}
}

export default (
  sequelize: Sequelize.Sequelize,
  dt: typeof Sequelize.DataTypes
) => {
  Question.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: dt.BIGINT.UNSIGNED
      },
      question_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      answer_vi: {
        allowNull: false,
        type: dt.TEXT()
      },
      question_en: {
        type: dt.TEXT()
      },
      answern_en: {
        type: dt.TEXT()
      },
      display: {
        allowNull: false,
        type: dt.INTEGER()
      },

      ...commonFields(dt)
    },
    {
      hooks: {
        beforeCreate: async (question) => {
          return sequelize
            .query(`UPDATE questions SET display = display + 1;`)
            .then(() => {
              question.display = 1;
            });
        },
        afterUpdate: async (question: any) => {
          if (
            question.dataValues.display !== question._previousDataValues.display
          ) {
            if (
              question._previousDataValues.display < question.dataValues.display
            ) {
              sequelize.query(
                `UPDATE questions SET display = display - 1 WHERE display <= ${question.dataValues.display} AND display > ${question._previousDataValues.display} AND NOT id = ${question.dataValues.id}`
              );
            } else {
              sequelize.query(
                `UPDATE questions SET display = display + 1 WHERE display >= ${question.dataValues.display} AND display < ${question._previousDataValues.display} AND NOT id = ${question.dataValues.id}`
              );
            }
          }
        },
        beforeDestroy: async (question) => {
          return sequelize
            .query(
              `UPDATE questions SET display = display - 1 WHERE display > ${question.display}`
            )
            .then();
        }
      },
      sequelize,
      tableName: 'questions'
    }
  );

  return Question;
};
