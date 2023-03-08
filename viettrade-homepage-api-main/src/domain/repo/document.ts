import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class DocumentRepository extends BaseRepository {
  public readonly model: DB['Document'];
  public readonly categoryDocumentModel: DB['CategoryDocument'];

  constructor(db: DB) {
    super(db);
    this.model = db.Document;
    this.categoryDocumentModel = db.CategoryDocument;
  }

  public async create(
    data: types.document.CreateParams,
    fileName: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newDocument = await this.model.create(
        {
          category_id: data.category_id,
          title_vi: data.title_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          description_en: data.description_en,
          feature_document: fileName
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newDocument.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    postId: string | number,
    data: types.document.UpdateParams,
    fileName: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const document: any = await this.model.findByPk(postId);
      const updateDocument = await document.update(
        {
          category_id: data.category_id,
          title_vi: data.title_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          description_en: data.description_en,
          feature_document: fileName
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateDocument.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(documentId: string | number) {
    let document: any = await this.model.findByPk(documentId);
    document = addBaseUrlToData(document, 'feature_document');
    return document;
  }

  public async search(params: types.document.SearchParams) {
    const findOption = await this.makeFindOption(params);

    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_document');
    return {
      rows,
      count
    };
  }

  private async makeFindOption(params?: types.post.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: [
        {
          model: this.categoryDocumentModel,
          required: true,
          attributes: [
            'id',
            'title_vi',
            'title_en',
            ['category_id', 'parent_category_id']
          ]
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
            'description_vi',
            'title_en',
            'description_en'
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
          findOption.order = <any>[
            params.sortColumn === 'parent_category_id'
              ? [{ model: this.categoryDocumentModel }, 'category_id', 'DESC']
              : [params.sortColumn || 'createdAt', 'DESC']
          ];
        } else {
          findOption.order = <any>[
            params.sortColumn === 'parent_category_id'
              ? [{ model: this.categoryDocumentModel }, 'category_id', 'ASC']
              : [params.sortColumn || 'createdAt', 'ASC']
          ];
        }
      } else {
        findOption.order = [
          [params.sortColumn ? params.sortColumn : 'createdAt', 'DESC']
        ];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  public async delete(documentId: string | number) {
    await this.model.destroy({
      where: {
        id: documentId
      }
    });
  }
}
