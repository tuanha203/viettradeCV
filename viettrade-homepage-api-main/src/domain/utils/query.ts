import { map } from 'lodash';
import * as moment from 'moment';
import { Op, OrOperator, WhereAttributeHash } from 'sequelize';

export const makeAmbiguousCondition = <T extends object>(
  params: T,
  field: keyof T,
  searchField?: string
): WhereAttributeHash => {
  if (searchField === undefined) {
    return {
      [field]: { [Op.like]: `%${params[field]}%` }
    };
  } else {
    return {
      [searchField]: { [Op.like]: `%${params[field]}%` }
    };
  }
};

export const makeMultipleAmbiguousCondition = <T extends object>(
  params: T,
  field: keyof T,
  searchFields: string[]
): OrOperator => ({
  [Op.or]: map(searchFields, (searchField) =>
    makeAmbiguousCondition(params, field, searchField)
  )
});

export const makeFromToCondtion = (
  field: string,
  range: { from?: number | string; to?: number | string }
) => {
  const result: WhereAttributeHash[] = [];
  if (range.from !== undefined) {
    result.push({
      [field]: { [Op.gte]: range.from }
    });
  }
  if (range.to !== undefined) {
    result.push({
      [field]: { [Op.lte]: range.to }
    });
  }

  return result;
};

/* array of valid datetime format
 */
export const dateTimeDefined = [
  'YYYY-MM-DD',
  'YYYY-M-D',
  'YYYY/MM/DD',
  'YYYY/M/D',
  'YYYY-MM-DD HH:mm:ss',
  'YYYY-M-D HH:mm:ss',
  'YYYY-MM-DD H:m:s',
  'YYYY-M-D H:m:s',
  'YYYY/MM/DD HH:mm:ss',
  'YYYY/M/D HH:mm:ss',
  'YYYY/MM/DD H:m:s',
  'YYYY/M/D H:m:s'
];

/**
 * validate datetime
 */
export const isValidDateTime = (
  value: Date | string
): false | moment.Moment | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const date = moment(value, dateTimeDefined, true);
  if (date.isValid()) {
    return date;
  } else {
    return false;
  }
};

/**
 * search date From To
 */
export const searchDateFromTo = (
  date: { from?: Date | undefined | string; to?: Date | string | undefined },
  option?: { time?: boolean | undefined }
) => {
  let whereDate = {};
  const time = option ? option.time : false;

  if (date.from !== undefined && date.from !== '') {
    const dateFrom = moment(date.from, dateTimeDefined, true);
    whereDate = {
      ...whereDate,
      [Op.gte]: dateFrom.isValid()
        ? `${moment(date.from).format('YYYY-MM-DD')}T00:00:00+00:00`
        : 'error'
    };
  }
  if (date.to !== undefined && date.to !== '') {
    const dateTo = moment(date.to, dateTimeDefined, true);
    whereDate = {
      ...whereDate,
      [Op.lte]: dateTo.isValid()
        ? `${moment(date.to).format('YYYY-MM-DD')}${
            time === true ? 'T23:59:59+00:00' : ''
          }`
        : null
    };
  }

  return whereDate;
};

/**
 * search date From To
 */
export const searchDateTimeFromTo = (date: {
  from?: Date | undefined | string;
  to?: Date | string | undefined;
}) => {
  let whereDate = {};

  if (date.from !== undefined && date.from !== '') {
    const dateFrom = moment(date.from, dateTimeDefined, true);
    whereDate = {
      ...whereDate,
      [Op.gte]: dateFrom.isValid()
        ? `${moment(`${date.from} 00:00:00`)
            .subtract(9, 'hour')
            .format('YYYY-MM-DD HH:mm:ss')}`
        : 'error'
    };
  }
  if (date.to !== undefined && date.to !== '') {
    const dateTo = moment(date.to, dateTimeDefined, true);
    whereDate = {
      ...whereDate,
      [Op.lte]: dateTo.isValid()
        ? `${moment(`${date.to} 23:59:59`)
            .subtract(9, 'hour')
            .format('YYYY-MM-DD HH:mm:ss')}`
        : null
    };
  }

  return whereDate;
};
