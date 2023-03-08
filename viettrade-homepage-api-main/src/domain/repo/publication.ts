import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class PublicationRepository extends BaseRepository {
  public readonly model: DB['Publication'];

  constructor(db: DB) {
    super(db);
    this.model = db.Publication;
  }

  public async create(
    data: types.publication.CreateParams,
    fileImage: string | undefined,
    filePdf: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newPublic = await this.model.create(
        {
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          description_en: data.description_en,
          pdf_file: filePdf,
          display: data.display,
          feature_image: fileImage
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newPublic.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    publicId: string | number,
    data: types.publication.UpdateParams,
    fileImage: string | undefined,
    filePdf: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const publication: any = await this.model.findByPk(publicId);
      const updatePublic = await publication.update(
        {
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          description_vi: data.description_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          description_en: data.description_en,
          pdf_file: filePdf,
          display: data.display,
          feature_image: fileImage
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updatePublic.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(publicId: string | number) {
    let publication: any = await this.model.findByPk(publicId);
    publication = addBaseUrlToData(publication, 'feature_image');
    publication = addBaseUrlToData(publication, 'pdf_file');
    return publication;
  }

  public async search(params: types.publication.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    rows = addBaseUrlToData(rows, 'pdf_file');
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.publication.SearchParams) {
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
            'title_en',
            'content_en',
            'pdf_file'
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
        findOption.order = [['createdAt', 'ASC']];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  public async delete(publicId: string | number) {
    const publication = await this.model.findByPk(publicId);
    if (publication) {
      return publication.destroy();
    }
  }
}
