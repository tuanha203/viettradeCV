"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.body = exports.S = exports.V = void 0;
const express_validator_1 = require("express-validator");
const sanitizers = require("./sanitizers");
const validators = require("./validators");
exports.V = validators;
exports.S = sanitizers;
/**
 * base validator function
 * @param checkType check from request body or request query
 * @param field field name to be checked
 * @param fieldNameJpOrRules set of rules or logical field name to display in error message
 * @param rules set of rules apply to field
 */
const validator = (checkType, field, fieldNameJpOrRules, rules) => {
    let check = (0, express_validator_1.body)(field);
    if (checkType === 'query') {
        check = (0, express_validator_1.query)(field);
    }
    let fieldName = '';
    let ruleSet = rules;
    if (typeof fieldNameJpOrRules === 'string') {
        fieldName = fieldNameJpOrRules;
    }
    else {
        ruleSet = fieldNameJpOrRules;
    }
    if (ruleSet !== undefined) {
        for (const rule of ruleSet) {
            check = rule(check, fieldName);
        }
    }
    return check;
};
function body(field, fieldNameJpOrRules, rules) {
    return validator('body', field, fieldNameJpOrRules, rules);
}
exports.body = body;
function query(field, fieldNameJpOrRules, rules) {
    return validator('query', field, fieldNameJpOrRules, rules);
}
exports.query = query;
//# sourceMappingURL=index.js.map