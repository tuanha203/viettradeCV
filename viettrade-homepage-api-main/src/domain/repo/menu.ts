import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { types } from '../../common';
import { DB } from '../model';
import { query } from '../utils';
import BaseRepository from './_base';

export default class MenuRepository extends BaseRepository {
  public readonly model: DB['Menu'];

  constructor(db: DB) {
    super(db);
    this.model = db.Menu;
  }

  public async create(data: types.menu.CreateParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      const newMenu = await this.model.create(
        {
          title_vi: data.title_vi,
          title_en: data.title_en,
          link: data.link,
          display: data.display,
          parent_id: data.parent_id
        },
        { transaction }
      );
      await transaction.commit();

      return {
        menu: newMenu
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(menuId: string | number, data: types.menu.UpdateParams) {
    const transaction = await this.db.sequelize.transaction();
    try {
      const menu: any = await this.model.findByPk(menuId);
      const updateMenu = await menu.update(
        {
          title_vi: data.title_vi,
          title_en: data.title_en,
          link: data.link,
          display: data.display,
          parent_id: data.parent_id
        },
        { transaction }
      );
      await transaction.commit();

      return {
        menu: updateMenu
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async searchId(menuId: string | number) {
    const menu: any = await this.model.findByPk(menuId);
    return menu;
  }

  public async searchSubMenu(menuId: string | number) {
    const findOption: FindAndCountOptions = {
      include: []
    };
    const andArray: WhereOptions[] = [];

    andArray.push({ parent_id: menuId });

    findOption.where = { [Op.and]: andArray };
    findOption.order = [['createdAt', 'DESC']];

    const subMenu = await this.model.findAll(findOption);
    return subMenu;
  }

  public async updateDisplay(data: types.menu.UpdateDisplayParams) {
    const menuSource: any = await this.model.findByPk(data.source);
    const menuDestination: any = await this.model.findByPk(data.destination);
    const transaction = await this.db.sequelize.transaction();
    try {
      const updateMenuSource = await menuSource.update(
        {
          display: data.display_source
        },
        { transaction }
      );
      const updateMenuDestination = await menuDestination.update(
        {
          display: data.display_destination
        },
        { transaction }
      );
      await transaction.commit();

      return {
        menuSource: updateMenuSource,
        menuDestination: updateMenuDestination
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async search(params: types.menu.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    const { rows, count } = await this.model.findAndCountAll(findOption);
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.menu.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: [
        {
          model: this.model,
          order: [['createdAt', 'DESC']],
          include: [{ model: this.model, order: [['createdAt', 'DESC']] }]
        }
      ]
    };
    if (params !== undefined) {
      const andArray: WhereOptions[] = [];
      andArray.push({
        ['parent_id']: 0
      });
      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'title_vi',
            'title_en',
            'link'
          ])
        );
      }

      if (params.title_vi !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'title_vi'));
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

  public async delete(menuId: string | number) {
    const menu = await this.model.findByPk(menuId);
    const transaction = await this.db.sequelize.transaction();
    try {
      await menu?.destroy();
      await transaction.commit();
      return {
        menu: menu
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
