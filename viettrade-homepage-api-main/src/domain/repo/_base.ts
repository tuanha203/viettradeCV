import { filter, isArray, isNumber, isString, map } from 'lodash';
import * as Sequelize from 'sequelize';
import { Op } from 'sequelize';

import { errors, messages } from '../../common';
import { DB } from '../model';

/**
 * Base class for other repository
 * common function is inside this class
 */
export default abstract class BaseRepository {
  public readonly db: DB; // set as public property to easily mocking in unit test
  protected readonly commonExclude: string[] = [];
  protected readonly extraExclude: string[] = ['createdAt', 'updatedAt'];

  constructor(db: DB) {
    this.db = db;
  }

  protected setOffsetLimit(
    findOptions: Sequelize.FindOptions,
    option?: { offset?: string | number; limit?: string | number }
  ) {
    if (option !== undefined) {
      if (!isNaN(Number(option.offset)) && option.offset !== '') {
        findOptions.offset = Number(option.offset);
      }

      if (!isNaN(Number(option.limit)) && option.limit !== '') {
        findOptions.limit = Number(option.limit);
      }
    }
  }

  protected notFoundError(
    result: [number, any[]] | number | null | any,
    errorStr: string
  ) {
    if (
      result === null ||
      (result instanceof Array && result[0] === 0) ||
      (result instanceof Array && result.length === 0) ||
      (typeof result === 'number' && result === 0)
    ) {
      throw new errors.NotFound(errorStr);
    }
  }

  /**
   * checkForeignKey
   *
   * @param ids
   * @param table
   */
  protected async checkForeignKey(
    ids: string[] | number[] | string | number | undefined,
    table: any,
    setting: {
      field: string;
      msg: string;
    }
  ) {
    const idList = isArray(ids)
      ? <string[]>filter(ids, (t) => t !== undefined)
      : isString(ids) || isNumber(ids)
      ? [ids]
      : [];

    const idListObjects = await table.findAll({
      where: {
        id: {
          [Op.in]: map(idList)
        }
      }
    });

    if (idListObjects.length !== idList.length) {
      throw new errors.Argument(
        setting.field,
        messages.notFoundParameterError(setting.msg)
      );
    }
  }
}
