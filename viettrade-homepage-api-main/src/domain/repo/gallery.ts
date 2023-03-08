import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { query } from '../utils';
import BaseRepository from './_base';

export default class GalleryRepository extends BaseRepository {
  public readonly model: DB['Gallery'];

  constructor(db: DB) {
    super(db);
    this.model = db.Gallery;
  }

  public async create(data: types.gallery.CreateParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newGallery = await this.model.create(
        {
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          feature_video: data.feature_video
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newGallery.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    galleryId: string | number,
    data: types.gallery.UpdateParams
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const gallery: any = await this.model.findByPk(galleryId);
      const updateGallery = await gallery.update(
        {
          title_vi: data.title_vi,
          content_vi: data.content_vi,
          title_en: data.title_en,
          content_en: data.content_en,
          feature_video: data.feature_video
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateGallery.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(galleryId: string | number) {
    const gallery: any = await this.model.findByPk(galleryId);
    return gallery;
  }

  public async search(params: types.gallery.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    const { rows, count } = await this.model.findAndCountAll(findOption);
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.gallery.SearchParams) {
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
            'content_en'
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
          findOption.order = [['createdAt', 'DESC']];
        } else {
          findOption.order = [['createdAt', 'ASC']];
        }
      } else {
        findOption.order = [['createdAt', 'DESC']];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  public async delete(galleryId: string | number) {
    await this.model.destroy({
      where: {
        id: galleryId
      }
    });
  }
}
