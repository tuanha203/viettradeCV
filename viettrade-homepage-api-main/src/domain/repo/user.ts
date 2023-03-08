import * as crypto from 'crypto';
import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { errors, messages, types } from '../../common';
import { DB } from '../model';
import { query } from '../utils';
import BaseRepository from './_base';

export default class UserRepository extends BaseRepository {
  public readonly model: DB['User'];

  constructor(db: DB) {
    super(db);
    this.model = db.User;
  }

  public async create(data: types.user.CreateParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      // userデータ
      const user = await this.model.findOne({ where: { email: data.email } });
      if (user) {
        throw new errors.Argument('email', messages.errorIsExist('email'));
      }
      const newUser = await this.model.create(
        {
          ...hashPassword(data.password),
          role: types.user.Role.USER,
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status ? data.status : types.user.Status.ACTIVE
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newUser.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(data: types.user.UpdateParams, userId: string) {
    const transaction = await this.db.sequelize.transaction();

    try {
      let user: any;
      if (data.email !== undefined) {
        user = await this.model.findOne({
          where: { email: data.email }
        });
        if (user && user.id !== parseInt(userId)) {
          throw new errors.Argument('email', messages.errorIsExist('email'));
        }
        user = await this.model.findByPk(userId);
      } else {
        user = await this.model.findByPk(userId);
      }
      const updateUser = await user.update(
        {
          ...hashPassword(data.password ? data.password : ''),
          role: data.role,
          phone: data.phone,
          name: data.name,
          email: data.email,
          status: data.status
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateUser.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async updateUser(
    data: types.user.UpdateParams,
    userId: number | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      let user: any;
      if (!userId) {
        throw new errors.Argument('userId', messages.authError);
      }
      if (data.email !== undefined) {
        user = await this.model.findOne({
          where: { email: data.email }
        });
        if (user && user.id !== userId) {
          throw new errors.Argument('email', messages.errorIsExist('email'));
        }
        user = await this.model.findByPk(userId);
      } else {
        user = await this.model.findByPk(userId);
      }
      const updateUser = await user.update(
        {
          ...hashPassword(data.password ? data.password : ''),
          phone: data.phone,
          name: data.name,
          email: data.email
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateUser.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async search(params: types.user.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);
    const { rows, count } = await this.model.findAndCountAll(findOption);
    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.user.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };
    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'name',
            'email',
            'phone'
          ])
        );
      }

      if (params.type !== undefined) {
        if (params.type === 'user') {
          andArray.push({ role: types.user.Role.USER });
        }
        if (params.type === 'admin') {
          andArray.push({
            role: [types.user.Role.ADMIN, types.user.Role.CONTENT]
          });
        }
      }
      if (params.email !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'email'));
      }
      if (params.status !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'status'));
      }
      if (params.phone !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'phone'));
      }
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
        findOption.order = [['createdAt', 'DESC']];
      }
      findOption.distinct = true;
      findOption.subQuery = false;
      findOption.where = { [Op.and]: andArray };
    }
    return findOption;
  }

  public async searchId(userId: string | number) {
    const user: any = await this.model.findByPk(userId);
    return user;
  }

  public async delete(userId: string | number) {
    await this.model.destroy({
      where: {
        id: userId
      }
    });
  }

  public async createAdmin(data: types.user.CreateParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      // userデータ
      const newUser = await this.model.create(
        {
          ...hashPassword(data.password),
          role: data.role,
          name: data.name,
          phone: data.phone,
          email: data.email,
          status: types.user.Status.ACTIVE
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newUser.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async register(data: types.user.RegisterParams) {
    const transaction = await this.db.sequelize.transaction();

    try {
      // userデータ
      const user = await this.model.findOne({ where: { email: data.email } });
      if (user) {
        throw new errors.Argument('email', messages.errorIsExist('email'));
      }

      const newUser = await this.model.create(
        {
          ...hashPassword(data.password),
          role: types.user.Role.USER,
          name: data.name,
          phone: data.phone,
          email: data.email,
          status: types.user.Status.ACTIVE
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newUser.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}

export function hashPassword(password: string) {
  if (password !== '') {
    const randomSalt = Math.random()
      .toString(36)
      .substring(2)
      .substring(0, 10);
    const hashedPassword = crypto
      .createHmac('sha256', randomSalt)
      .update(password)
      .digest('hex');

    return {
      salt: randomSalt,
      password: hashedPassword
    };
  }
  return;
}
