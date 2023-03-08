import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { addBaseUrlToData, query } from '../utils';
import BaseRepository from './_base';

export default class DepartmentRepository extends BaseRepository {
  public readonly model: DB['Department'];

  constructor(db: DB) {
    super(db);
    this.model = db.Department;
  }

  public async create(
    data: types.department.CreateParams,
    fileName: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newDepartment = await this.model.create(
        {
          parent_id: data.parent_id,
          full_name: data.full_name,
          position_vi: data.position_vi,
          position_en: data.position_en,
          phone: data.phone,
          email: data.email,
          feature_image: fileName
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newDepartment.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    departmentId: string | number,
    data: types.department.UpdateParams,
    fileName: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const department: any = await this.model.findByPk(departmentId);
      const updateDepartment = await department.update(
        {
          parent_id: data.parent_id,
          full_name: data.full_name,
          position_vi: data.position_vi,
          position_en: data.position_en,
          phone: data.phone,
          email: data.email,
          feature_image: fileName
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateDepartment.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(departmentId: string | number) {
    let department: any = await this.model.findByPk(departmentId, {
      include: [
        {
          model: this.model,
          order: [['createdAt', 'DESC']],
          include: [{ model: this.model, order: [['createdAt', 'DESC']] }]
        }
      ]
    });
    department = addBaseUrlToData(department, 'feature_image');
    return department;
  }

  public async search(params: types.department.SearchParams) {
    const findOption = this.makeFindOption(params, false);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    return {
      rows,
      count
    };
  }

  public async searchAll(params: types.department.SearchParams) {
    const findOption = this.makeFindOption(params, true);
    this.setOffsetLimit(findOption, params);
    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');
    return {
      rows,
      count
    };
  }

  private makeFindOption(
    params?: types.department.SearchParams,
    isSearchAll?: Boolean
  ) {
    const findOption: FindAndCountOptions = isSearchAll
      ? {}
      : {
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

      if (!isSearchAll) {
        andArray.push({
          ['parent_id']: '0'
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
            'email'
          ])
        );
      }

      if (params.full_name !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'full_name'));
      }

      if (params.parent_id !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'parent_id'));
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

  public async delete(departmentId: string | number) {
    await this.model.destroy({
      where: {
        id: departmentId
      }
    });
  }
}
