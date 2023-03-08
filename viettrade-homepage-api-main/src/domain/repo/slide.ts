import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class SlideRepository extends BaseRepository {
  public readonly model: DB['Slide'];

  constructor(db: DB) {
    super(db);
    this.model = db.Slide;
  }

  public async create(
    data: types.slide.CreateParams,
    fileName: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newSlide = await this.model.create(
        {
          title: data.title,
          link: data.link,
          display: data.display,
          feature_image: fileName
        },
        { transaction }
      );
      await transaction.commit();

      return {
        slide: newSlide
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    slideId: string | number,
    data: types.slide.UpdateParams,
    fileName: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const slide: any = await this.model.findByPk(slideId);
      const updateSlide = await slide.update(
        {
          title: data.title,
          link: data.link,
          display: data.display,
          feature_image: fileName
        },
        { transaction }
      );
      await transaction.commit();

      return {
        slide: updateSlide
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(slideId: string | number) {
    let slide: any = await this.model.findByPk(slideId);
    slide = addBaseUrlToData(slide, 'feature_image');
    return slide;
  }

  public async updateDisplay(data: types.slide.UpdateDisplayParams) {
    const slideSource: any = await this.model.findByPk(data.source);
    const slideDestination: any = await this.model.findByPk(data.destination);
    const transaction = await this.db.sequelize.transaction();
    try {
      const updateSlideSource = await slideSource.update(
        {
          display: data.display_source
        },
        { transaction }
      );
      const updateSlideDestination = await slideDestination.update(
        {
          display: data.display_destination
        },
        { transaction }
      );
      await transaction.commit();

      return {
        SlideSource: updateSlideSource,
        SlideDestination: updateSlideDestination
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async search(params: types.slide.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.slide.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'title',
            'link'
          ])
        );
      }

      if (params.title !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'title'));
      }

      findOption.where = { [Op.and]: andArray };

      if (params.sort !== undefined) {
        if (`${params.sort}`.toLowerCase() === 'desc') {
          findOption.order = [['createdAt', 'DESC']];
        } else {
          findOption.order = [['createdAt', 'ASC']];
        }
      } else {
        findOption.order = [['createdAt', 'ASC']];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  public async delete(slideId: string | number) {
    const slide = await this.model.findByPk(slideId);
    const transaction = await this.db.sequelize.transaction();
    try {
      await slide?.destroy();
      await transaction.commit();
      return {
        slide: slide
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
