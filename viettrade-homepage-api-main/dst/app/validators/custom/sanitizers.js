"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayOfString = exports.emptyStringAsNull = exports.removeIfNull = exports.multipleValueAsArray = exports.searchNumberSanitizer = void 0;
const lodash_1 = require("lodash");
const MAX_INT_VALUE = (Math.pow(2, 64) * 2 + 1).toString();
const searchNumberSanitizerFunction = (value) => !(0, lodash_1.isUndefined)(value) && value !== '' && isNaN(value)
    ? MAX_INT_VALUE
    : value;
/**
 * Since default behavior of MySQL is returning record
 * with value of 0 (field type is number) when searching by text,
 * we need to change inputed text to a very big number, so no record
 * returned from query
 */
const searchNumberSanitizer = (check, _fieldNameJp) => check.custom((value, meta) => {
    if (value !== undefined && value !== '') {
        (0, lodash_1.set)(meta.req[meta.location], meta.path, searchNumberSanitizerFunction(value));
    }
    return true;
});
exports.searchNumberSanitizer = searchNumberSanitizer;
const stringToArrayTransformer = (value, meta) => {
    if (value === undefined) {
        return true;
    }
    if (value instanceof Array) {
        const uniqArr = (0, lodash_1.uniq)(value);
        if (uniqArr.length === 0 || (uniqArr.length === 1 && uniqArr[0] === '')) {
            (0, lodash_1.unset)(meta.req.body, meta.path);
        }
        else {
            meta.req[meta.location][meta.path] = value.map(searchNumberSanitizerFunction);
        }
    }
    else if (value.length === 0) {
        (0, lodash_1.unset)(meta.req.body, meta.path);
    }
    else {
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
const multipleValueAsArray = (check, _fieldNameJp) => check.custom(stringToArrayTransformer);
exports.multipleValueAsArray = multipleValueAsArray;
const removeIfNull = (check, _fieldNameJp) => check.custom((value, meta) => {
    if (value === null) {
        (0, lodash_1.unset)(meta.req[meta.location], meta.path);
    }
    return true;
});
exports.removeIfNull = removeIfNull;
/**
 * transform paramater to null if it is empty string
 */
const emptyStringAsNull = (check, _fieldNameJp) => check.custom((value, meta) => {
    if (value === undefined || value === null) {
        return true;
    }
    else if (value.length === 0) {
        (0, lodash_1.set)(meta.req[meta.location], meta.path, null);
    }
    return true;
});
exports.emptyStringAsNull = emptyStringAsNull;
/**
 * Filter to get only string array
 */
const arrayOfString = (check, _fieldNameJp) => check.custom((value, meta) => {
    if (value === undefined || value === null) {
        return true;
    }
    else if (value instanceof Array) {
        const array = value.filter((e) => typeof e === 'string' && e !== '');
        if (array.length === 0) {
            (0, lodash_1.unset)(meta.req.body, meta.path);
        }
        else {
            (0, lodash_1.set)(meta.req[meta.location], meta.path, array);
        }
    }
    else if ((0, lodash_1.isObject)(value)) {
        const array = [];
        for (const [k, v] of Object.entries(value)) {
            if (!isNaN(Number(k))) {
                array.push(v);
            }
        }
        if (array.length === 0) {
            (0, lodash_1.unset)(meta.req.body, meta.path);
        }
        else {
            (0, lodash_1.set)(meta.req[meta.location], meta.path, array);
        }
    }
    else if (value.length === 0) {
        (0, lodash_1.unset)(meta.req.body, meta.path);
    }
    else {
        stringToArrayTransformer(value.split(','), meta);
    }
    return true;
});
exports.arrayOfString = arrayOfString;
//# sourceMappingURL=sanitizers.js.map