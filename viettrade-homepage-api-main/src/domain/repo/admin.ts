import * as crypto from 'crypto';
import { pick as _pick } from 'lodash';
import { FindAndCountOptions, Op, WhereOptions } from 'sequelize';

import { errors, messages, types } from '../../common';
import { DB } from '../model';
import { query } from '../utils';
import BaseRepository from './_base';
import { addBaseUrlToData } from './../utils/index';

export default class AdminRepository extends BaseRepository {
  public readonly model: DB['Admin'];

  constructor(db: DB) {
    super(db);
    this.model = db.Admin;
  }

  public async create(
    data: types.admin.CreateParams,
    filename: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      // userデータ
      const admin = await this.model.findOne({ where: { email: data.email } });
      if (admin) {
        throw new errors.Argument('email', messages.errorIsExist('email'));
      }
      const newAdmin = await this.model.create(
        {
          ...hashPassword(data.password),
          role: data.role,
          name: data.name,
          email: data.email,
          feature_image: filename,
          status: data.status ? data.status : types.admin.Status.ACTIVE
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newAdmin.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async update(
    data: types.admin.UpdateParams,
    adminId: string,
    filename: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      let admin: any;
      if (data.email !== undefined) {
        admin = await this.model.findOne({
          where: { email: data.email }
        });
        if (admin && admin.id !== parseInt(adminId)) {
          throw new errors.Argument('email', messages.errorIsExist('email'));
        }
        admin = await this.model.findByPk(adminId);
      } else {
        admin = await this.model.findByPk(adminId);
      }
      const updateAdmin = await admin.update(
        {
          ...hashPassword(data.password ? data.password : ''),
          role: data.role,
          name: data.name,
          email: data.email,
          status: data.status,
          feature_image: filename
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: updateAdmin.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async search(params: types.admin.SearchParams) {
    const findOption = this.makeFindOption(params);
    this.setOffsetLimit(findOption, params);

    let { rows, count } = await this.model.findAndCountAll(findOption);
    rows = addBaseUrlToData(rows, 'feature_image');

    return {
      rows,
      count
    };
  }

  private makeFindOption(params?: types.admin.SearchParams) {
    const findOption: FindAndCountOptions = {
      include: []
    };
    if (params !== undefined) {
      const andArray: WhereOptions[] = [];

      if (params.search !== undefined) {
        andArray.push(
          query.makeMultipleAmbiguousCondition(params, 'search', [
            'name',
            'email'
          ])
        );
      }

      if (params.type !== undefined) {
        if (params.type === 'admin') {
          andArray.push({
            role: [types.admin.Role.ADMIN, types.admin.Role.CONTENT]
          });
        }
      }

      if (params.email !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'email'));
      }

      if (params.role !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'role'));
      }

      if (params.status !== undefined) {
        andArray.push(query.makeAmbiguousCondition(params, 'status'));
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

  public async searchId(adminId: string | number) {
    let admin: any = await this.model.findByPk(adminId);
    admin = addBaseUrlToData(admin, 'feature_image');
    return admin;
  }

  public async delete(adminId: string | number) {
    await this.model.destroy({
      where: {
        id: adminId
      }
    });
  }

  public async createAdmin(
    data: types.admin.CreateParams,
    filename: string | undefined
  ) {
    const transaction = await this.db.sequelize.transaction();

    try {
      // userデータ
      const newAdmin = await this.model.create(
        {
          ...hashPassword(data.password),
          role: data.role,
          name: data.name,
          email: data.email,
          status: types.admin.Status.ACTIVE,
          feature_image: filename
        },
        { transaction }
      );
      await transaction.commit();

      return {
        id: newAdmin.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public async login(params: types.auth.LoginParams) {
    const adminInfo = await this.model.findOne({
      where: {
        email: params.email
      }
    });

    if (adminInfo !== null) {
      if (adminInfo.status === types.admin.Status.INACTIVE) {
        return { success: false, messages: [messages.inActive] };
      }

      if (
        [
          types.admin.Role.ADMIN,
          types.admin.Role.CONTENT,
          types.admin.Role.MANAGER
        ].indexOf(adminInfo.role) === -1
      ) {
        return { success: false, messages: [messages.dataMismatchingError] };
      }
    } else {
      return { success: false, messages: [messages.passwordError] };
    }

    const hashedPassword = crypto
      .createHmac('sha256', adminInfo.salt)
      .update(params.password)
      .digest('hex');

    if (hashedPassword !== adminInfo.password) {
      // password not match, return error
      return { success: false, messages: [messages.passwordError] };
      // throw new errors.Argument('email, password', messages.passwordError);
    }
    adminInfo.set('lastLoginAt', new Date());
    await adminInfo.save();
    let newAdminInfo = adminInfo;
    newAdminInfo = addBaseUrlToData(adminInfo, 'feature_image');
    return newAdminInfo;
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
