"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMessage = exports.messages = void 0;
/* eslint-disable no-irregular-whitespace */
exports.messages = {
    authError: 'Not authorized',
    notFoundParameterError: (paramName) => `Failed to process because it is not registered in the database (${paramName})`,
    undefinedValueError: ($1) => `Input not defined. (${$1})`,
    passwordError: 'Incorrect email or password.',
    dataMismatchingError: 'Processing could not be executed due to data inconsistency. Please contact your system administrator',
    systemError: 'A system error has occurred.',
    invalidTokenError: 'INVALID_TOKEN',
    documentUploadTypeError: 'The document format is incorrect. xlsx, doc, pptx, pdf, png, jpg, jpeg.',
    documentUploadSizeError: (size) => `The upper limit  (${size}) of material upload size is exceeded.`,
    fileImportTypeError: `Unauthorized capture file.`,
    fileImportFormatError: `The import file is not in CSV format.`,
    fileImportSizeError: (size) => `Exceeded the upper limit of import file size (${size}MB)`,
    fileImportCharsetError: `The character code of the import file is incorrect.`,
    errorIsExist: ($1) => `${$1} is exist`,
    sendEmailFail: 'Send email failed!',
    inActive: 'Account is inactive!'
};
exports.validationMessage = {
    'ec-00001': 'params_is_required',
    'ec-00002': 'param_max_length',
    'ec-00003': (p) => `「${p}」Please enter in half-width numbers.`,
    'ec-00004': ($1) => `「${$1}」Please enter in the correct format.`,
    'ec-00005': ($1) => `「${$1}」is not in the correct format.`,
    'ec-00006': ($1) => `「${$1}」Please enter only half-width numbers and periods.`,
    'ec-00007': ($1, $2, $3) => `「${$1}」Please enter within ${$2} characters for the integer part and within ${$3} characters for the decimal part.`,
    'ec-00008': 'param_min_length'
};
//# sourceMappingURL=constant.js.map