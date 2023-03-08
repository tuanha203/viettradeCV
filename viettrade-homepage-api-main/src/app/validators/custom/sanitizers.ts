import { Meta, ValidationChain } from 'express-validator';
import { isObject, isUndefined, set, uniq, unset } from 'lodash';

const MAX_INT_VALUE = (Math.pow(2, 64) * 2 + 1).toString();

const searchNumberSanitizerFunction = (value: string) =>
  !isUndefined(value) && value !== '' && isNaN(<any>value)
    ? MAX_INT_VALUE
    : value;

/**
 * Since default behavior of MySQL is returning record
 * with value of 0 (field type is number) when searching by text,
 * we need to change inputed text to a very big number, so no record
 * returned from query
 */
export const searchNumberSanitizer = (
  check: ValidationChain,
  _fieldNameJp: string
) =>
  check.custom((value: string, meta: Meta) => {
    if (value !== undefined && value !== '') {
      set(
        meta.req[meta.location],
        meta.path,
        searchNumberSanitizerFunction(value)
      );
    }

    return true;
  });

const stringToArrayTransformer = (value: string | string[], meta: Meta) => {
  if (value === undefined) {
    return true;
  }
  if (value instanceof Array) {
    const uniqArr = uniq(value);
    if (uniqArr.length === 0 || (uniqArr.length === 1 && uniqArr[0] === '')) {
      unset(meta.req.body, meta.path);
    } else {
      meta.req[meta.location][meta.path] = value.map(
        searchNumberSanitizerFunction
      );
    }
  } else if (value.length === 0) {
    unset(meta.req.body, meta.path);
  } else {
    stringToArrayTransformer(value.split(','), meta);
  }

  return true;
};

/**
 * transform string of multiple value into array
 * @example
 * INPUT: '1,2,3,4'
 * RESULT: [1, 2, 3, 4]
 */
export const multipleValueAsArray = (
  check: ValidationChain,
  _fieldNameJp: string
) => check.custom(stringToArrayTransformer);

export const removeIfNull = (check: ValidationChain, _fieldNameJp: string) =>
  check.custom((value, meta) => {
    if (value === null) {
      unset(meta.req[meta.location], meta.path);
    }

    return true;
  });

/**
 * transform paramater to null if it is empty string
 */
export const emptyStringAsNull = (
  check: ValidationChain,
  _fieldNameJp: string
) =>
  check.custom((value, meta) => {
    if (value === undefined || value === null) {
      return true;
    } else if (value.length === 0) {
      set(meta.req[meta.location], meta.path, null);
    }

    return true;
  });

/**
 * Filter to get only string array
 */
export const arrayOfString = (check: ValidationChain, _fieldNameJp: string) =>
  check.custom((value, meta) => {
    if (value === undefined || value === null) {
      return true;
    } else if (value instanceof Array) {
      const array = value.filter((e) => typeof e === 'string' && e !== '');
      if (array.length === 0) {
        unset(meta.req.body, meta.path);
      } else {
        set(meta.req[meta.location], meta.path, array);
      }
    } else if (isObject(value)) {
      const array = [];
      for (const [k, v] of Object.entries(value)) {
        if (!isNaN(Number(k))) {
          array.push(v);
        }
      }
      if (array.length === 0) {
        unset(meta.req.body, meta.path);
      } else {
        set(meta.req[meta.location], meta.path, array);
      }
    } else if (value.length === 0) {
      unset(meta.req.body, meta.path);
    } else {
      stringToArrayTransformer(value.split(','), meta);
    }

    return true;
  });
