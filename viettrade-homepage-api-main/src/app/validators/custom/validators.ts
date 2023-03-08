import * as encoding from 'encoding-japanese';
import { Meta, ValidationChain } from 'express-validator';
import {
  filter,
  includes,
  isEqual,
  isNil,
  isUndefined,
  keys,
  set
} from 'lodash';
import * as moment from 'moment';

import {
  messages as extraMessages,
  validationMessages as messages
} from '../../../common';

const ACCEPTED_DATE_FORMAT = ['YYYY-M-D', 'YYYY/M/D'];
const ACCEPTED_DATE_TIME_FORMAT = ['YYYY-M-D HH:mm:ss', 'YYYY/M/D HH:mm:ss'];
const ACCEPTED_TIME_FORMAT = ['HH:mm:ss'];

const checkNumberString = (value: string) => /^-?\d+$/.test(value);

export const validDate = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => moment(value, ACCEPTED_DATE_FORMAT, true).isValid())
    .withMessage(messages['ec-00004'](fieldName));

export const validDateTime = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => moment(value, ACCEPTED_DATE_TIME_FORMAT, true).isValid())
    .withMessage(messages['ec-00004'](fieldName));

export const validTime = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => moment(value, ACCEPTED_TIME_FORMAT, true).isValid())
    .withMessage(messages['ec-00004'](fieldName));

export const hiragana = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => !/[^ぁ-ゔゞ゛゜ー]/.test(value))
    .withMessage(messages['ec-00004'](fieldName));

/**
 * only accept number
 */
export const isDigits = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value, meta) => {
      // workaround to get japanese name of id field
      set(meta.req, `locals.${meta.path}`, fieldName);

      return /^\d+$/.test(value);
    })
    .withMessage(messages['ec-00003'](fieldName));

/**
 * only accept number
 */
export const isDigitsV2 = (skipUndefined: boolean = false) => (
  check: ValidationChain,
  fieldName: string
) =>
  check
    .custom((value, meta) => {
      if (isNil(value) && skipUndefined === true) {
        return true;
      }

      // workaround to get japanese name of id field
      set(meta.req, `locals.${meta.path}`, fieldName);

      return /^\d+$/.test(value);
    })
    .withMessage(messages['ec-00003'](fieldName));

export const isUUID = (check: ValidationChain, fieldName: string) =>
  check.isUUID().withMessage(messages['ec-00004'](fieldName));

/**
 * return false for negative value
 */
export const isUnsigned = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value: string) => {
      if (/^-?\d+$/.test(value) || /^-?(\d+\.)?\d+$/.test(value)) {
        // negative value => return false
        return !(/^-\d+$/.test(value) || /^-(\d+\.)?\d+$/.test(value));
      } else {
        // ingore non-numeric value (return true)
        return true;
      }
    })
    .withMessage(messages['ec-00004'](fieldName));

export const maxLength = (length: number) => (
  check: ValidationChain,
  fieldName: string
) =>
  check
    .isLength({ max: length })
    .withMessage({ message: messages['ec-00002'], args: [fieldName, length] });

export const minLength = (length: number) => (
  check: ValidationChain,
  fieldName: string
) =>
  check
    .isLength({ min: length })
    .withMessage({ message: messages['ec-00008'], args: [fieldName, length] });

/**
 * custom max length use for number,
 * exlcude minus character of number
 * @param length max length of value
 */

export const numberMaxLength = (length: number) => (
  check: ValidationChain,
  fieldName: string
) =>
  check
    .custom((value: string | null) => {
      if (value === null) {
        return true;
      }
      const strValue = `${value}`; // convert value to string
      if (strValue[0] === '-') {
        return strValue.length <= length + 1;
      } else {
        return strValue.length <= length;
      }
    })
    .withMessage({ message: messages['ec-00002'], args: [fieldName, length] });

export const optional = (check: ValidationChain, _: string) =>
  check.optional({ checkFalsy: false, nullable: true });

export const required = (check: ValidationChain, fieldName: string) =>
  check
    .exists({ checkNull: true })
    .withMessage({ message: messages['ec-00001'], args: [fieldName] });

/**
 * Checks a field is blank and reference to many fields
 * @param fields
 */
export const requiredIf = (
  fields: {
    type: 'params' | 'auth';
    field: string;
    operator: '!==' | '===';
    valChk: any;
  }[]
) => (check: ValidationChain, fieldName: string) =>
  check
    .custom((value: string | null, meta: Meta) => {
      const conds = fields.filter((v) => {
        const target = `meta.req.${
          v.type === 'params' ? meta.location : 'user'
        }.${v.field}`;

        const compare = isEqual(`${eval(target)}`, `${v.valChk}`);
        return v.operator === '===' ? compare : !compare;
      });

      if (conds.length === fields.length && isNil(value)) {
        return false;
      }

      return true;
    })
    .withMessage({ message: messages['ec-00001'], args: [fieldName] });

/**
 * only accept decimal number
 */
export const isDecimal = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => /^-?(\d+\.)?\d+$/.test(value))
    .withMessage(messages['ec-00006'](fieldName));

/**
 * check length of decimal number
 * length 10,1
 */
export const isDecimal101 = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => /^-?[\d]{1,9}(\.[\d]{1,1})?$/.test(value))
    .withMessage(messages['ec-00004'](fieldName));

/**
 * check length of decimal number
 * length 10,2
 */
export const isDecimal21 = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => /^-?[\d]{1,1}(\.[\d]{1,1})?$/.test(value))
    .withMessage(messages['ec-00007'](fieldName, '1', '1'));

/**
 * check length of decimal number
 * length 2,1
 */
export const isDecimal102 = (check: ValidationChain, fieldName: string) =>
  check
    .custom((value) => /^-?[\d]{1,8}(\.[\d]{1,2})?$/.test(value))
    .withMessage(messages['ec-00004'](fieldName));
// TODO: Change messsage ec-00007

/**
 * check maxlength textarea
 */
export const textareaMaxLength = (maxlen: number) => (
  check: ValidationChain,
  fieldName: string
) =>
  check
    .custom((value: string, meta: Meta) => {
      if (value === null) {
        // ignore when no data provided
        return true;
      }

      // also sanitize data before saving to db
      const text = value.replace(/\r\n/g, '\n');
      meta.req[meta.location][meta.path] = text;

      return text.length <= maxlen;
    })
    .withMessage({ message: messages['ec-00002'], args: [fieldName, maxlen] });

/**
 * @params valueFlag: String
 * if value of relatedField = valueFlag then not check required
 */
export const isRequiredWith = (relatedField: string, valueFlag: string) => (
  check: ValidationChain,
  fieldName: string
) =>
  check
    .custom((value: string, meta: Meta) => {
      if (
        (value !== null && value !== undefined && value !== '') ||
        meta.req[meta.location][relatedField] === valueFlag
      ) {
        return true;
      } else {
        return false;
      }
    })
    .withMessage({ message: messages['ec-00001'], args: [fieldName] });

export const valueOf = (obj: object, skipUndefined = false) => (
  check: ValidationChain,
  fieldName: string
) =>
  check
    .custom((value: string) => {
      if (isUndefined(value) && skipUndefined) {
        return true;
      }

      const valueList = filter(keys(obj), checkNumberString);
      if (value === null) {
        return true;
      } else {
        return includes(valueList, `${value}`);
      }
    })
    .withMessage(extraMessages.undefinedValueError(fieldName));

export const importType = (obj: object) => (
  check: ValidationChain,
  _fieldNameJp: string
) =>
  check
    .custom((value: string) => {
      if (value === null) {
        return true;
      } else {
        return includes(keys(obj), `${value}`);
      }
    })
    .withMessage(extraMessages.fileImportTypeError);

/**
 * email validator
 * @param value email to be tested
 */
export const isValidEmail = (check: ValidationChain, fieldName: string) =>
  // tslint:disable-next-line: max-line-length
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  check
    .custom((value) => {
      if (value === '') {
        return true;
      } else {
        return /^([a-z0-9_+.-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/.test(
          value
        );
      }
    })
    .withMessage(messages['ec-00005'](fieldName));
/**
 * name vietnamese validator
 * @param value name vietnamese to be tested
 */
export const isValidNameVN = (check: ValidationChain, fieldName: string) =>
  // tslint:disable-next-line: max-line-length
  // const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  check
    .custom((value) => {
      if (value === '') {
        return true;
      } else {
        return /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s|_]+$/.test(
          value
        );
      }
    })
    .withMessage(messages['ec-00005'](fieldName));
/**
 * File required validator
 */
export const requiredFile = (check: ValidationChain, fieldName: string) =>
  check
    .custom((_value: string, meta: Meta) => {
      const files = meta.req.files;
      if (files[meta.path] !== undefined) {
        return true;
      }
      return false;
    })
    .withMessage({ message: messages['ec-00001'], args: [fieldName] });

/**
 * File required validator
 */
export const requiredSingleFile = (check: ValidationChain, fieldName: string) =>
  check
    .custom((_value: string, meta: Meta) => {
      if (meta.req.file !== undefined) {
        return true;
      }
      return false;
    })
    .withMessage({ message: messages['ec-00001'], args: [fieldName] });

export const isCSV = (check: ValidationChain, _fieldNameJp: string) =>
  check
    .custom((_value: string, meta: Meta) => {
      const file = meta.req.file;
      if (file) {
        const fileType = file.originalname
          .split('.')
          .pop()!
          .toLowerCase();

        return fileType == 'csv';
      }

      return true;
    })
    .withMessage(extraMessages.fileImportFormatError);

export const csvSize = (check: ValidationChain, _fieldNameJp: string) =>
  check
    .custom((_value: string, meta: Meta) => {
      const file = meta.req.file;
      const MAX_FILE_SIZE =
        parseInt(process.env.IMPORT_CSV_SIZE_LIMIT || '2', 10) * 1024 * 1024;
      if (file && file.size > MAX_FILE_SIZE) {
        return false;
      }

      return true;
    })
    .withMessage(
      extraMessages.fileImportSizeError(
        process.env.IMPORT_CSV_SIZE_LIMIT || '2'
      )
    );

export const isShift_JIS = (check: ValidationChain, _fieldNameJp: string) =>
  check
    .custom((_value: string, meta: Meta) => {
      const file = meta.req.file;
      if (file) {
        return encoding.detect(file.buffer) == 'SJIS';
      }

      return true;
    })
    .withMessage(extraMessages.fileImportCharsetError);

export const isDocument = (check: ValidationChain, _fieldNameJp: string) =>
  check
    .custom((_value: string, meta: Meta) => {
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
          .pop()!
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
    .withMessage(extraMessages.documentUploadTypeError);

export const documentSize = (check: ValidationChain, _fieldNameJp: string) =>
  check
    .custom((_value: string, meta: Meta) => {
      const files = meta.req.files;
      const file = files[meta.path] ? files[meta.path][0] : undefined;
      const envMaxDocumentSize: string =
        process.env.DOCUMENT_UPLOAD_SIZE_LIMIT || '100';
      const MAX_FILE_SIZE = parseInt(envMaxDocumentSize, 10) * 1024 * 1024;
      if (file && file.size > MAX_FILE_SIZE) {
        return false;
      }
      return true;
    })
    .withMessage(
      extraMessages.documentUploadSizeError(
        process.env.DOCUMENT_UPLOAD_SIZE_LIMIT || '100'
      )
    );
