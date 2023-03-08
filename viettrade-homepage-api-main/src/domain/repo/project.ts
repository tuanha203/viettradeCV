import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class ProjectRepository extends BaseRepository {
  public readonly model: DB['Project'];
  public readonly categoryModel: DB['Category'];

  constructor(db: DB) {
    super(db);
    this.model = db.Project;
    this.categoryModel = db.Category;
  }

  public async create(
    data: types.project.CreateParams,
    fileName: string | undefined,
    documentFile: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newProject = await this.model.create(
        {
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          description_en: data.description_en,
          feature_image: fileName,
          feature_document: documentFile
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newProject.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    projectId: string | number,
    data: types.project.UpdateParams,
    fileName: string | undefined,
    documentFile: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const project: any = await this.model.findByPk(projectId);
      const updateProject = await project.update(
        {
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          description_en: data.description_en,
          feature_image: fileName,
          feature_document: documentFile
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateProject.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(projectId: string | number) {
    let project: any = await this.model.findByPk(projectId);
    project = addBaseUrlToData(project, 'feature_image');
    return project;
  }

  public async search(params: types.project.SearchParams) {
    const findOption = await this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');

    return {
      rows,
      count
    };
  }

  private async makeFindOption(params?: types.project.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'title_vi',
            'content_vi',
            'description_vi',
            'title_en',
            'content_en',
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

  public async delete(projectId: string | number) {
    await this.model.destroy({
      where: {
        id: projectId
      }
    });
  }
}
