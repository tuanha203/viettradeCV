import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class CategoryRepository extends BaseRepository {
  public readonly model: DB['Category'];
  public readonly postModel: DB['Post'];

  constructor(db: DB) {
    super(db);
    this.model = db.Category;
    this.postModel = db.Post;
  }

  public async create(
    data: types.category.CreateParams,
    image: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newCategory = await this.model.create(
        {
          title_vi: data.title_vi,
          title_en: data.title_en,
          feature_image: image,
          display: data.display
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newCategory.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    categoryId: string | number,
    data: types.category.UpdateParams,
    image: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const category: any = await this.model.findByPk(categoryId);
      const updateCategory = await category.update(
        {
          title_vi: data.title_vi,
          title_en: data.title_en,
          feature_image: image
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateCategory.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateDisplay(
    categoryId: string | number,
    data: types.category.UpdateDisplayParams
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const category: any = await this.model.findByPk(categoryId);
      const updateCategory = await category.update(
        {
          display: data.display
        },
        { transaction }
      );
      await transaction.commit();

      return {
        category: updateCategory
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  public async delete(categoryId: string | number) {
    const category = await this.model.findByPk(categoryId);
    if (category) {
      return category.destroy();
    }
  }

  public async searchId(categoryId: string | number) {
    const category: any = await this.model.findByPk(categoryId);
    return category;
  }

  public async search(params: types.category.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);
    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = JSON.parse(JSON.stringify(rows));
    rows.map((doc) => {
      doc.Posts = addBaseUrlToData(doc.Posts, 'feature_image');
    });
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.category.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: [
        {
          model: this.postModel,
          limit: 1,
          order: [['createdAt', 'DESC']],
          where: { publish: types.post.Publish.PUBLISH }
        }
      ]
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'category_id',
            'title_vi',
            'title_en'
          ])
        );
      }

      if (params.title_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'title_vi'));
      }

      if (params.title_en !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'title_en'));
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
          ['updatedAt', 'ASC']
        ];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }
}
