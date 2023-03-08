import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class CompanyRepository extends BaseRepository {
  public readonly model: DB['Company'];

  constructor(db: DB) {
    super(db);
    this.model = db.Company;
  }

  public async create(
    data: types.company.CreateParams,
    image: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newCompany = await this.model.create(
        {
          name_vi: data.name_vi,
          description_vi: data.description_vi,
          name_en: data.name_en,
          description_en: data.description_en,
          feature_image: image,
          link: data.link,
          display: 0,
          connective: data.connective,
          phone: data.phone,
          address: data.address,
          status: 1
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newCompany.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    companyId: string | number,
    data: types.company.UpdateParams,
    image: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const company: any = await this.model.findByPk(companyId);
      const updateCompany = await company.update(
        {
          name_vi: data.name_vi,
          description_vi: data.description_vi,
          name_en: data.name_en,
          description_en: data.description_en,
          feature_image: image,
          link: data.link,
          display: data.display,
          connective: data.connective,
          phone: data.phone,
          address: data.address
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateCompany.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateDisplay(
    companyId: string | number,
    data: types.company.UpdateParams
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const company: any = await this.model.findByPk(companyId);
      const updateCompany = await company.update(
        {
          display: data.display
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateCompany.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(companyId: string | number) {
    let company: any = await this.model.findByPk(companyId);
    company = addBaseUrlToData(company, 'feature_image');
    return company;
  }

  public async search(params: types.company.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    return {
      rows,
      count
    };
  }

  public async searchAll(params: types.company.SearchParams) {
    const findOption = this.makeFindOptionAll(params);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    return {
      rows,
      count
    };
  }

  private makeFindOptionAll(params?: types.company.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.status !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'status'));
      }

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'name_vi',
            'description_vi',
            'name_en',
            'description_en',
            'link'
          ])
        );
      }

      if (params.name_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'name_vi'));
      }

      if (params.name_en !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'name_en'));
      }

      if (params.connective !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'connective'));
      }

      findOption.where = { [Op.and]: andArray };

      if (params.sort !== undefined) {
        if (`${params.sort}`.toLowerCase() === 'desc') {
          findOption.order = [
            [params.sortColumn ? params.sortColumn : 'display', 'DESC'],
            ['updatedAt', 'DESC']
          ];
        } else {
          findOption.order = [
            [params.sortColumn ? params.sortColumn : 'display', 'ASC'],
            ['updatedAt', 'ASC']
          ];
        }
      } else {
        findOption.order = [
          ['display', 'ASC'],
          ['updatedAt', 'DESC']
        ];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  private makeFindOption(params?: types.company.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };

    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      andArray.push({
        ['status']: {
          [Op.in]: [types.company.Status.ACTIVE]
        }
      });

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'name_vi',
            'description_vi',
            'name_en',
            'description_en',
            'link'
          ])
        );
      }

      if (params.name_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'name_vi'));
      }

      if (params.name_en !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'name_en'));
      }

      if (params.connective !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'connective'));
      }

      findOption.where = { [Op.and]: andArray };

      if (params.sort !== undefined) {
        if (`${params.sort}`.toLowerCase() === 'desc') {
          findOption.order = [
            [params.sortColumn ? params.sortColumn : 'display', 'DESC'],
            ['updatedAt', 'DESC']
          ];
        } else {
          findOption.order = [
            [params.sortColumn ? params.sortColumn : 'display', 'ASC'],
            ['updatedAt', 'ASC']
          ];
        }
      } else {
        findOption.order = [
          ['display', 'ASC'],
          ['updatedAt', 'DESC']
        ];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
    }

    return findOption;
  }

  public async approve(companyId: string, status: number) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const company: any = await this.model.findByPk(companyId);
      const updateCompany = await company.update(
        {
          status: status
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateCompany.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async delete(companyId: string | number) {
    const company = await this.model.findByPk(companyId);
    if (company) {
      return company.destroy();
    }
  }
}
