import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { query } from '../utils';
import BaseRepository from './_base';

export default class QuestionRepository extends BaseRepository {
  public readonly model: DB['Question'];

  constructor(db: DB) {
    super(db);
    this.model = db.Question;
  }

  public async create(data: types.question.CreateParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newQuestion = await this.model.create(
        {
          question_vi: data.question_vi,
          answer_vi: data.answer_vi,
          question_en: data.question_en,
          answern_en: data.answern_en,
          display: 0
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newQuestion.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    questionId: string | number,
    data: types.question.UpdateParams
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const question = await this.model.findByPk(questionId);
      const updateQuestion = await question?.update(
        {
          question_vi: data.question_vi,
          answer_vi: data.answer_vi,
          question_en: data.question_en,
          answern_en: data.answern_en,
          display: data.display
        },
        { transaction }
      );

      await transaction.commit();

      return {
        id: updateQuestion?.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(questionId: string | number) {
    const question: any = await this.model.findByPk(questionId);
    return question;
  }

  public async search(params: types.question.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    const { rows, count } = await this.model.findAndCountAll(findOption);
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.question.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'question_vi',
            'answer_vi',
            'question_en',
            'answern_en',
            'display'
          ])
        );
      }

      if (params.question_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'question_vi'));
      }

      if (params.answer_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'answer_vi'));
      }

      findOption.where = { [Op.and]: andArray };

      if (params.sort !== undefined) {
        if (`${params.sort}`.toLowerCase() === 'desc') {
          findOption.order = [
            ['display', 'ASC'],
            ['createdAt', 'DESC']
          ];
        } else {
          findOption.order = [
            ['display', 'ASC'],
            ['createdAt', 'ASC']
          ];
        }
      } else {
        findOption.order = [
          ['display', 'ASC'],
          ['createdAt', 'ASC']
        ];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  public async delete(publicId: string | number) {
    const question = await this.model.findByPk(publicId);
    if (question) {
      return question.destroy();
    }
  }
}
