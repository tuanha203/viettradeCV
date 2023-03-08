import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class CategoryDocumentRepository extends BaseRepository {
  public readonly model: DB['CategoryDocument'];
  public readonly documentModel: DB['Document'];
  constructor(db: DB) {
    super(db);
    this.model = db.CategoryDocument;
    this.documentModel = db.Document;
  }

  public async create(data: types.categoryDocument.CreateParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newCategory = await this.model.create(
        {
          category_id: data.category_id ? data.category_id : 0,
          title_vi: data.title_vi,
          title_en: data.title_en
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
    categoryDocumentId: string | number,
    data: types.categoryDocument.UpdateParams
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const categoryDocument: any = await this.model.findByPk(
        categoryDocumentId
      );
      const updateCategoryDocument = await categoryDocument.update(
        {
          category_id: data.category_id,
          title_vi: data.title_vi,
          title_en: data.title_en
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateCategoryDocument.id
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

  public async search(params: types.categoryDocument.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);
    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = JSON.parse(JSON.stringify(rows));
    rows.map((doc) => {
      doc.Documents = addBaseUrlToData(doc.Documents, 'feature_document');
      doc.children?.map((child) => {
        child.Documents = addBaseUrlToData(child.Documents, 'feature_document');
      });
    });
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.categoryDocument.SearchParams) {
    const findOption: FindAndCountOptions = params?.all_levels
      ? {
          include: [
            {
              model: this.model,
              as: 'children',
              required: true,
              include: [
                {
                  model: this.documentModel,
                  limit: 999999,
                  required: true
                }
              ]
            },
            {
              model: this.documentModel,
              required: true,
              limit: 999999,
              order: [['createdAt', 'DESC']]
            }
          ]
        }
      : {
          include: [
            {
              model: this.documentModel,
              required: true,
              limit: 1,
              order: [['createdAt', 'DESC']]
            },
            {
              model: this.model,
              as: 'parent'
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
      if (params.category_id !== undefined) {
        andArray.push({ category_id: params.category_id });
      }

      findOption.where = { [Op.and]: andArray };

      if (params.sort !== undefined) {
        if (`${params.sort}`.toLowerCase() === 'desc') {
          findOption.order = [
            [params.sortColumn ? params.sortColumn : 'createdAt', 'DESC']
          ];
        } else {
          findOption.order = [
            [params.sortColumn ? params.sortColumn : 'createdAt', 'ASC']
          ];
        }
      } else {
        findOption.order = [
          ['category_id', 'ASC'],
          ['createdAt', 'ASC']
        ];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }
}
