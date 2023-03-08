import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { query } from '../utils';
import BaseRepository from './_base';

export default class StructureRepository extends BaseRepository {
  public readonly model: DB['Structure'];

  constructor(db: DB) {
    super(db);
    this.model = db.Structure;
  }

  public async create(data: types.structure.CreateParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newStructure = await this.model.create(
        {
          parent_id: data.parent_id,
          full_name_vi: data.full_name_vi,
          full_name_en: data.full_name_en,
          position_vi: data.position_vi,
          position_en: data.position_en,
          phone: data.phone,
          email: data.email,
          fax: data.fax,
          website: data.website,
          level: data.level,
          display: data.display,
          address: data.address
        },
        { transaction }
      );
      await transaction.commit();

      return {
        structure: newStructure
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    structureId: string | number,
    data: types.structure.UpdateParams
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const structure: any = await this.model.findByPk(structureId);
      const updateStructure = await structure.update(
        {
          parent_id: data.parent_id,
          full_name_vi: data.full_name_vi,
          full_name_en: data.full_name_en,
          position_vi: data.position_vi,
          position_en: data.position_en,
          phone: data.phone,
          fax: data.fax,
          website: data.website,
          email: data.email,
          level: data.level,
          display: data.display,
          address: data.address
        },
        { transaction }
      );
      await transaction.commit();

      return {
        structure: updateStructure
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(structureId: string | number) {
    const structure: any = await this.model.findByPk(structureId, {
      include: [
        {
          model: this.model,
          order: [['createdAt', 'DESC']],
          include: [{ model: this.model, order: [['createdAt', 'DESC']] }]
        }
      ]
    });
    return structure;
  }

  public async search(params: types.structure.SearchParams) {
    const findOption = this.makeFindOption(params, false);
    this.setOffsetLimit(findOption, params);

    const { rows, count } = await this.model.findAndCountAll(findOption);
    return {
      rows,
      count
    };
  }

  public async searchSub(strucId: string | number) {
    const findOption: FindAndCountOptions = {
      include: [
        {
          model: this.model,
          order: [['createdAt', 'DESC']],
          required: false,
          include: [
            {
              model: this.model,
              order: [['createdAt', 'DESC']],
              required: false
            }
          ]
        }
      ]
    };
    const andArray: WhereOptions[] = [];

    andArray.push({ parent_id: strucId });

    findOption.where = { [Op.and]: andArray };
    findOption.order = [['createdAt', 'DESC']];

    const subStructure = await this.model.findAll(findOption);
    return subStructure;
  }

  public async searchAll(params: types.structure.SearchParams) {
    const findOption = this.makeFindOption(params, true);
    this.setOffsetLimit(findOption, params);

    const { rows, count } = await this.model.findAndCountAll(findOption);
    return {
      rows,
      count
    };
  }

  public async updateDisplay(data: types.structure.UpdateDisplayParams) {
    const structureSource: any = await this.model.findByPk(data.source);
    const structureDestination: any = await this.model.findByPk(
      data.destination
    );
    const transaction = await this.db.sequelize.transaction();
    try {
      const updateStructureSource = await structureSource.update(
        {
          display: data.display_source
        },
        { transaction }
      );
      const updateStructureDestination = await structureDestination.update(
        {
          display: data.display_destination
        },
        { transaction }
      );
      await transaction.commit();

      return {
        menuSource: updateStructureSource,
        menuDestination: updateStructureDestination
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  private makeFindOption(
    params?: types.structure.SearchParams,
    isSearchAllLevel?: Boolean
  ) {
    const findOption: FindAndCountOptions = {
      include: [
        {
          model: this.model,
          order: [['createdAt', 'DESC']],
          required: false,
          include: [
            {
              model: this.model,
              order: [['createdAt', 'DESC']],
              required: false
            }
          ]
        }
      ]
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (isSearchAllLevel) {
        andArray.push({
          ['level']: [1, 2]
        });
      } else {
        andArray.push({
          ['level']: [1]
        });
      }

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'parent_id',
            'full_name',
            'position_vi',
            'position_en',
            'phone',
            'fax',
            'website',
            'email'
          ])
        );
      }

      if (params.full_name_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'full_name_vi'));
      }
      if (params.full_name_en !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'full_name_en'));
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

  public async delete(structureId: string | number) {
    const structure = await this.model.findByPk(structureId);
    const transaction = await this.db.sequelize.transaction();
    try {
      await structure?.destroy();
      await transaction.commit();
      return {
        structure: structure
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
