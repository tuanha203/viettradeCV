"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.documentSize = exports.isDocument = exports.isShift_JIS = exports.csvSize = exports.isCSV = exports.requiredSingleFile = exports.requiredFile = exports.isValidNameVN = exports.isValidEmail = exports.importType = exports.valueOf = exports.isRequiredWith = exports.textareaMaxLength = exports.isDecimal102 = exports.isDecimal21 = exports.isDecimal101 = exports.isDecimal = exports.requiredIf = exports.required = exports.optional = exports.numberMaxLength = exports.minLength = exports.maxLength = exports.isUnsigned = exports.isUUID = exports.isDigitsV2 = exports.isDigits = exports.hiragana = exports.validTime = exports.validDateTime = exports.validDate = void 0;
const encoding = require("encoding-japanese");
const lodash_1 = require("lodash");
const moment = require("moment");
const common_1 = require("../../../common");
const ACCEPTED_DATE_FORMAT = ['YYYY-M-D', 'YYYY/M/D'];
const ACCEPTED_DATE_TIME_FORMAT = ['YYYY-M-D HH:mm:ss', 'YYYY/M/D HH:mm:ss'];
const ACCEPTED_TIME_FORMAT = ['HH:mm:ss'];
const checkNumberString = (value) => /^-?\d+$/.test(value);
const validDate = (check, fieldName) => check
    .custom((value) => moment(value, ACCEPTED_DATE_FORMAT, true).isValid())
    .withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.validDate = validDate;
const validDateTime = (check, fieldName) => check
    .custom((value) => moment(value, ACCEPTED_DATE_TIME_FORMAT, true).isValid())
    .withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.validDateTime = validDateTime;
const validTime = (check, fieldName) => check
    .custom((value) => moment(value, ACCEPTED_TIME_FORMAT, true).isValid())
    .withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.validTime = validTime;
const hiragana = (check, fieldName) => check
    .custom((value) => !/[^ぁ-ゔゞ゛゜ー]/.test(value))
    .withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.hiragana = hiragana;
/**
 * only accept number
 */
const isDigits = (check, fieldName) => check
    .custom((value, meta) => {
    // workaround to get japanese name of id field
    (0, lodash_1.set)(meta.req, `locals.${meta.path}`, fieldName);
    return /^\d+$/.test(value);
})
    .withMessage(common_1.validationMessages['ec-00003'](fieldName));
exports.isDigits = isDigits;
/**
 * only accept number
 */
const isDigitsV2 = (skipUndefined = false) => (check, fieldName) => check
    .custom((value, meta) => {
    if ((0, lodash_1.isNil)(value) && skipUndefined === true) {
        return true;
    }
    // workaround to get japanese name of id field
    (0, lodash_1.set)(meta.req, `locals.${meta.path}`, fieldName);
    return /^\d+$/.test(value);
})
    .withMessage(common_1.validationMessages['ec-00003'](fieldName));
exports.isDigitsV2 = isDigitsV2;
const isUUID = (check, fieldName) => check.isUUID().withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.isUUID = isUUID;
/**
 * return false for negative value
 */
const isUnsigned = (check, fieldName) => check
    .custom((value) => {
    if (/^-?\d+$/.test(value) || /^-?(\d+\.)?\d+$/.test(value)) {
        // negative value => return false
        return !(/^-\d+$/.test(value) || /^-(\d+\.)?\d+$/.test(value));
    }
    else {
        // ingore non-numeric value (return true)
        return true;
    }
})
    .withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.isUnsigned = isUnsigned;
const maxLength = (length) => (check, fieldName) => check
    .isLength({ max: length })
    .withMessage({ message: common_1.validationMessages['ec-00002'], args: [fieldName, length] });
exports.maxLength = maxLength;
const minLength = (length) => (check, fieldName) => check
    .isLength({ min: length })
    .withMessage({ message: common_1.validationMessages['ec-00008'], args: [fieldName, length] });
exports.minLength = minLength;
/**
 * custom max length use for number,
 * exlcude minus character of number
 * @param length max length of value
 */
const numberMaxLength = (length) => (check, fieldName) => check
    .custom((value) => {
    if (value === null) {
        return true;
    }
    const strValue = `${value}`; // convert value to string
    if (strValue[0] === '-') {
        return strValue.length <= length + 1;
    }
    else {
        return strValue.length <= length;
    }
})
    .withMessage({ message: common_1.validationMessages['ec-00002'], args: [fieldName, length] });
exports.numberMaxLength = numberMaxLength;
const optional = (check, _) => check.optional({ checkFalsy: false, nullable: true });
exports.optional = optional;
const required = (check, fieldName) => check
    .exists({ checkNull: true })
    .withMessage({ message: common_1.validationMessages['ec-00001'], args: [fieldName] });
exports.required = required;
/**
 * Checks a field is blank and reference to many fields
 * @param fields
 */
const requiredIf = (fields) => (check, fieldName) => check
    .custom((value, meta) => {
    const conds = fields.filter((v) => {
        const target = `meta.req.${v.type === 'params' ? meta.location : 'user'}.${v.field}`;
        const compare = (0, lodash_1.isEqual)(`${eval(target)}`, `${v.valChk}`);
        return v.operator === '===' ? compare : !compare;
    });
    if (conds.length === fields.length && (0, lodash_1.isNil)(value)) {
        return false;
    }
    return true;
})
    .withMessage({ message: common_1.validationMessages['ec-00001'], args: [fieldName] });
exports.requiredIf = requiredIf;
/**
 * only accept decimal number
 */
const isDecimal = (check, fieldName) => check
    .custom((value) => /^-?(\d+\.)?\d+$/.test(value))
    .withMessage(common_1.validationMessages['ec-00006'](fieldName));
exports.isDecimal = isDecimal;
/**
 * check length of decimal number
 * length 10,1
 */
const isDecimal101 = (check, fieldName) => check
    .custom((value) => /^-?[\d]{1,9}(\.[\d]{1,1})?$/.test(value))
    .withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.isDecimal101 = isDecimal101;
/**
 * check length of decimal number
 * length 10,2
 */
const isDecimal21 = (check, fieldName) => check
    .custom((value) => /^-?[\d]{1,1}(\.[\d]{1,1})?$/.test(value))
    .withMessage(common_1.validationMessages['ec-00007'](fieldName, '1', '1'));
exports.isDecimal21 = isDecimal21;
/**
 * check length of decimal number
 * length 2,1
 */
const isDecimal102 = (check, fieldName) => check
    .custom((value) => /^-?[\d]{1,8}(\.[\d]{1,2})?$/.test(value))
    .withMessage(common_1.validationMessages['ec-00004'](fieldName));
exports.isDecimal102 = isDecimal102;
// TODO: Change messsage ec-00007
/**
 * check maxlength textarea
 */
const textareaMaxLength = (maxlen) => (check, fieldName) => check
    .custom((value, meta) => {
    if (value === null) {
        // ignore when no data provided
        return true;
    }
    // also sanitize data before saving to db
    const text = value.replace(/\r\n/g, '\n');
    meta.req[meta.location][meta.path] = text;
    return text.length <= maxlen;
})
    .withMessage({ message: common_1.validationMessages['ec-00002'], args: [fieldName, maxlen] });
exports.textareaMaxLength = textareaMaxLength;
/**
 * @params valueFlag: String
 * if value of relatedField = valueFlag then not check required
 */
const isRequiredWith = (relatedField, valueFlag) => (check, fieldName) => check
    .custom((value, meta) => {
    if ((value !== null && value !== undefined && value !== '') ||
        meta.req[meta.location][relatedField] === valueFlag) {
        return true;
    }
    else {
        return false;
    }
})
    .withMessage({ message: common_1.validationMessages['ec-00001'], args: [fieldName] });
exports.isRequiredWith = isRequiredWith;
const valueOf = (obj, skipUndefined = false) => (check, fieldName) => check
    .custom((value) => {
    if ((0, lodash_1.isUndefined)(value) && skipUndefined) {
        return true;
    }
    const valueList = (0, lodash_1.filter)((0, lodash_1.keys)(obj), checkNumberString);
    if (value === null) {
        return true;
    }
    else {
        return (0, lodash_1.includes)(valueList, `${value}`);
    }
})
    .withMessage(common_1.messages.undefinedValueError(fieldName));
exports.valueOf = valueOf;
const importType = (obj) => (check, _fieldNameJp) => check
    .custom((value) => {
    if (value === null) {
        return true;
    }
    else {
        return (0, lodash_1.includes)((0, lodash_1.keys)(obj), `${value}`);
    }
})
    .withMessage(common_1.messages.fileImportTypeError);
exports.importType = importType;
/**
 * email validator
 * @param value email to be tested
 */
const isValidEmail = (check, fieldName) => 
// tslint:disable-next-line: max-line-length
// const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
check
    .custom((value) => {
    if (value === '') {
        return true;
    }
    else {
        return /^([a-z0-9_+.-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/.test(value);
    }
})
    .withMessage(common_1.validationMessages['ec-00005'](fieldName));
exports.isValidEmail = isValidEmail;
/**
 * name vietnamese validator
 * @param value name vietnamese to be tested
 */
const isValidNameVN = (check, fieldName) => 
// tslint:disable-next-line: max-line-length
// const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
check
    .custom((value) => {
    if (value === '') {
        return true;
    }
    else {
        return /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]+$/.test(value);
    }
})
    .withMessage(common_1.validationMessages['ec-00005'](fieldName));
exports.isValidNameVN = isValidNameVN;
/**
 * File required validator
 */
const requiredFile = (check, fieldName) => check
    .custom((_value, meta) => {
    const files = meta.req.files;
    if (files[meta.path] !== undefined) {
        return true;
    }
    return false;
})
    .withMessage({ message: common_1.validationMessages['ec-00001'], args: [fieldName] });
exports.requiredFile = requiredFile;
/**
 * File required validator
 */
const requiredSingleFile = (check, fieldName) => check
    .custom((_value, meta) => {
    if (meta.req.file !== undefined) {
        return true;
    }
    return false;
})
    .withMessage({ message: common_1.validationMessages['ec-00001'], args: [fieldName] });
exports.requiredSingleFile = requiredSingleFile;
const isCSV = (check, _fieldNameJp) => check
    .custom((_value, meta) => {
    const file = meta.req.file;
    if (file) {
        const fileType = file.originalname
            .split('.')
            .pop()
            .toLowerCase();
        return fileType == 'csv';
    }
    return true;
})
    .withMessage(common_1.messages.fileImportFormatError);
exports.isCSV = isCSV;
const csvSize = (check, _fieldNameJp) => check
    .custom((_value, meta) => {
    const file = meta.req.file;
    const MAX_FILE_SIZE = parseInt(process.env.IMPORT_CSV_SIZE_LIMIT || '2', 10) * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
        return false;
    }
    return true;
})
    .withMessage(common_1.messages.fileImportSizeError(process.env.IMPORT_CSV_SIZE_LIMIT || '2'));
exports.csvSize = csvSize;
const isShift_JIS = (check, _fieldNameJp) => check
    .custom((_value, meta) => {
    const file = meta.req.file;
    if (file) {
        return encoding.detect(file.buffer) == 'SJIS';
    }
    return true;
})
    .withMessage(common_1.messages.fileImportCharsetError);
exports.isShift_JIS = isShift_JIS;
const isDocument = (check, _fieldNameJp) => check
    .custom((_value, meta) => {
    const files = meta.req.files;
    const file = files[meta.path] ? files[meta.path][0] : undefined;
    if (file !== undefined) {
        const allowFileExtension = [
            'xls',
            'xlsx',
            'doc',
            'docx',
            'ppt',
            'pptx',
            'pdf',
            'jpg',
            'jpeg',
            'png',
            'gif',
            'svg',
            'txt',
            'zip'
        ];
        const uploadFileType = file.originalname
            .split('.')
            .pop()
            .toLowerCase();
        if (allowFileExtension.indexOf(uploadFileType) < 0) {
            return false;
        }
        // * `doc/docx` => `doc`
        // * `xls/xlsx` => `xls`
        // * `ppt/pptx` => `ppt`
        // * `jpg/jpeg` => `jpg`
        switch (uploadFileType) {
            case 'docx':
                files[meta.path][0].originalname = 'document.doc';
                break;
            case 'xlsx':
                files[meta.path][0].originalname = 'document.xls';
                break;
            case 'pptx':
                files[meta.path][0].originalname = 'document.ppt';
                break;
            case 'jpeg':
                files[meta.path][0].originalname = 'document.jpg';
                break;
        }
    }
    return true;
})
    .withMessage(common_1.messages.documentUploadTypeError);
exports.isDocument = isDocument;
const documentSize = (check, _fieldNameJp) => check
    .custom((_value, meta) => {
    const files = meta.req.files;
    const file = files[meta.path] ? files[meta.path][0] : undefined;
    const envMaxDocumentSize = process.env.DOCUMENT_UPLOAD_SIZE_LIMIT || '100';
    const MAX_FILE_SIZE = parseInt(envMaxDocumentSize, 10) * 1024 * 1024;
    if (file && file.size > MAX_FILE_SIZE) {
        return false;
    }
    return true;
})
    .withMessage(common_1.messages.documentUploadSizeError(process.env.DOCUMENT_UPLOAD_SIZE_LIMIT || '100'));
exports.documentSize = documentSize;
//# sourceMappingURL=validators.js.map