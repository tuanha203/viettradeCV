"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editFileName = exports.checkNumberOnly = exports.emptyStringToNull = exports.pickForSearch = exports.pick = void 0;
const lodash_1 = require("lodash");
const path_1 = require("path");
const pick = (params, field) => {
    return (0, lodash_1.pick)(params, field);
};
exports.pick = pick;
/**
 * same as pick function but exclude undefined and empty string
 * @param params search parameter
 * @param fields field to pick
 */
const pickForSearch = (params, fields) => {
    return ((0, lodash_1.pickBy)(params, (value, key) => (0, lodash_1.includes)(fields, key) && !(0, lodash_1.isEmpty)(value)));
};
exports.pickForSearch = pickForSearch;
const emptyStringToNull = (value) => value === undefined || (typeof value === 'string' && value.length) === 0
    ? null
    : value;
exports.emptyStringToNull = emptyStringToNull;
const checkNumberOnly = (value) => !/^[0-9]*$/.test(value);
exports.checkNumberOnly = checkNumberOnly;
const editFileName = (req, file, callback) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    const random = ('' + Math.random()).substring(2, 8);
    const random_number = timestamp + random;
    // const name = file.originalname;
    // const subName = name.substr(name.lastIndexOf('.'));
    // const newName = name.replace(subName, '');
    const fileExtName = (0, path_1.extname)(file.originalname);
    // const randomName = Array(4)
    //   .fill(null)
    //   .map(() => Math.round(Math.random() * 16).toString(16))
    //   .join('');
    callback(null, `${random_number}${fileExtName}`, req);
};
exports.editFileName = editFileName;
//# sourceMappingURL=index.js.map