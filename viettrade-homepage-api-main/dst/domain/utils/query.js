"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDateTimeFromTo = exports.searchDateFromTo = exports.isValidDateTime = exports.dateTimeDefined = exports.makeFromToCondtion = exports.makeMultipleAmbiguousCondition = exports.makeAmbiguousCondition = void 0;
const lodash_1 = require("lodash");
const moment = require("moment");
const sequelize_1 = require("sequelize");
const makeAmbiguousCondition = (params, field, searchField) => {
    if (searchField === undefined) {
        return {
            [field]: { [sequelize_1.Op.like]: `%${params[field]}%` }
        };
    }
    else {
        return {
            [searchField]: { [sequelize_1.Op.like]: `%${params[field]}%` }
        };
    }
};
exports.makeAmbiguousCondition = makeAmbiguousCondition;
const makeMultipleAmbiguousCondition = (params, field, searchFields) => ({
    [sequelize_1.Op.or]: (0, lodash_1.map)(searchFields, (searchField) => (0, exports.makeAmbiguousCondition)(params, field, searchField))
});
exports.makeMultipleAmbiguousCondition = makeMultipleAmbiguousCondition;
const makeFromToCondtion = (field, range) => {
    const result = [];
    if (range.from !== undefined) {
        result.push({
            [field]: { [sequelize_1.Op.gte]: range.from }
        });
    }
    if (range.to !== undefined) {
        result.push({
            [field]: { [sequelize_1.Op.lte]: range.to }
        });
    }
    return result;
};
exports.makeFromToCondtion = makeFromToCondtion;
/* array of valid datetime format
 */
exports.dateTimeDefined = [
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
const isValidDateTime = (value) => {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }
    const date = moment(value, exports.dateTimeDefined, true);
    if (date.isValid()) {
        return date;
    }
    else {
        return false;
    }
};
exports.isValidDateTime = isValidDateTime;
/**
 * search date From To
 */
const searchDateFromTo = (date, option) => {
    let whereDate = {};
    const time = option ? option.time : false;
    if (date.from !== undefined && date.from !== '') {
        const dateFrom = moment(date.from, exports.dateTimeDefined, true);
        whereDate = Object.assign(Object.assign({}, whereDate), { [sequelize_1.Op.gte]: dateFrom.isValid()
                ? `${moment(date.from).format('YYYY-MM-DD')}T00:00:00+00:00`
                : 'error' });
    }
    if (date.to !== undefined && date.to !== '') {
        const dateTo = moment(date.to, exports.dateTimeDefined, true);
        whereDate = Object.assign(Object.assign({}, whereDate), { [sequelize_1.Op.lte]: dateTo.isValid()
                ? `${moment(date.to).format('YYYY-MM-DD')}${time === true ? 'T23:59:59+00:00' : ''}`
                : null });
    }
    return whereDate;
};
exports.searchDateFromTo = searchDateFromTo;
/**
 * search date From To
 */
const searchDateTimeFromTo = (date) => {
    let whereDate = {};
    if (date.from !== undefined && date.from !== '') {
        const dateFrom = moment(date.from, exports.dateTimeDefined, true);
        whereDate = Object.assign(Object.assign({}, whereDate), { [sequelize_1.Op.gte]: dateFrom.isValid()
                ? `${moment(`${date.from} 00:00:00`)
                    .subtract(9, 'hour')
                    .format('YYYY-MM-DD HH:mm:ss')}`
                : 'error' });
    }
    if (date.to !== undefined && date.to !== '') {
        const dateTo = moment(date.to, exports.dateTimeDefined, true);
        whereDate = Object.assign(Object.assign({}, whereDate), { [sequelize_1.Op.lte]: dateTo.isValid()
                ? `${moment(`${date.to} 23:59:59`)
                    .subtract(9, 'hour')
                    .format('YYYY-MM-DD HH:mm:ss')}`
                : null });
    }
    return whereDate;
};
exports.searchDateTimeFromTo = searchDateTimeFromTo;
//# sourceMappingURL=query.js.map