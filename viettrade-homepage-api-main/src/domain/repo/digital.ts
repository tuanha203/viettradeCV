import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class DigitalRepository extends BaseRepository {
  public readonly model: DB['Digital'];

  constructor(db: DB) {
    super(db);
    this.model = db.Digital;
  }

  public async create(
    data: types.digital.CreateParams,
    fileName: string | undefined,
    iconFile: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newDigital = await this.model.create(
        {
          title_vi: data.title_vi,
          title_en: data.title_en,
          feature_image: fileName,
          feature_icon: iconFile,
          link: data.link,
          display: 0
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newDigital.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    digitalId: string | number,
    data: types.digital.UpdateParams,
    fileName: string | undefined,
    iconFile: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const digital = await this.model.findByPk(digitalId);
      const updateDigital = await digital?.update(
        {
          title_vi: data.title_vi,
          title_en: data.title_en,
          feature_image: fileName,
          feature_icon: iconFile,
          link: data.link,
          display: data.display
        },
        { transaction }
      );

      await transaction.commit();

      return {
        id: updateDigital?.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateDisplay(data: types.digital.UpdateDisplayParams) {
    const digitalSource: any = await this.model.findByPk(data.source);
    const digitalDestination: any = await this.model.findByPk(data.destination);
    const transaction = await this.db.sequelize.transaction();
    try {
      const updateDigitalSource = await digitalSource.update(
        {
          display: data.display_source
        },
        { transaction }
      );
      const updateDigitalDestination = await digitalDestination.update(
        {
          display: data.display_destination
        },
        { transaction }
      );
      await transaction.commit();

      return {
        DigitalSource: updateDigitalSource,
        DigitalDestination: updateDigitalDestination
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(digitalId: string | number) {
    let digital: any = await this.model.findByPk(digitalId);
    digital = addBaseUrlToData(digital, 'feature_image');
    digital = addBaseUrlToData(digital, 'feature_icon');
    return digital;
  }

  public async search(params: types.digital.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);
    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    rows = addBaseUrlToData(rows, 'feature_icon');
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.digital.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'title_vi',
            'title_en',
            'display'
          ])
        );
      }

      if (params.title_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'title_vi'));
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
    const digital = await this.model.findByPk(publicId);
    if (digital) {
      return digital.destroy();
    }
  }
}
