import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class PostRepository extends BaseRepository {
  public readonly model: DB['Post'];
  public readonly categoryModel: DB['Category'];

  constructor(db: DB) {
    super(db);
    this.model = db.Post;
    this.categoryModel = db.Category;
  }

  public async create(
    data: types.post.CreateParams,
    fileName: string | undefined,
    documentFile: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newPost = await this.model.create(
        {
          category_id: data.category_id,
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          description_en: data.description_en,
          feature_image: fileName,
          feature_document: documentFile,
          publish: data.publish
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newPost.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    postId: string | number,
    data: types.post.UpdateParams,
    fileName: string | undefined,
    documentFile: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const post: any = await this.model.findByPk(postId);
      const updatePost = await post.update(
        {
          category_id: data.category_id,
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          description_en: data.description_en,
          feature_image: fileName,
          publish: data.publish,
          feature_document: documentFile
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updatePost.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(postId: string | number) {
    let post: any = await this.model.findByPk(postId);
    post = addBaseUrlToData(post, 'feature_image');
    return post;
  }

  public async search(params: types.post.SearchParams) {
    const findOption = await this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    return {
      rows,
      count
    };
  }

  private async makeFindOption(params?: types.post.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: [
        {
          model: this.categoryModel,
          required: true,
          attributes: ['id', 'title_vi', 'title_en']
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
            'content_vi',
            'description_vi',
            'title_en',
            'content_en',
            'description_en'
          ])
        );
      }

      if (params.publish !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'publish'));
      }

      if (params.role !== undefined) {
        if (
          parseInt(params.role) === types.admin.Role.ADMIN ||
          parseInt(params.role) === types.admin.Role.MANAGER
        ) {
          andArray.push({
            ['publish']: {
              [Op.in]: [types.post.Publish.PRIVATE, types.post.Publish.PUBLISH]
            }
          });
        } else {
          andArray.push({
            ['publish']: {
              [Op.in]: [types.post.Publish.PRIVATE, types.post.Publish.DRAFT]
            }
          });
        }
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
          [params.sortColumn ? params.sortColumn : 'createdAt', 'DESC']
        ];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  public async countView(postId: string | number) {
    try {
      await this.model.increment(
        {
          view_count: 1
        },
        {
          where: {
            id: postId
          }
        }
      );

      return {
        id: postId
      };
    } catch (error) {
      throw error;
    }
  }

  public async approve(postId: string, status: number) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const post: any = await this.model.findByPk(postId);
      const updatePost = await post.update(
        {
          publish: status
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updatePost.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(postId: string | number) {
    await this.model.destroy({
      where: {
        id: postId
      }
    });
  }
}
