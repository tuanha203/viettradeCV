import { body as b, query as q, ValidationChain } from 'express-validator';

import * as sanitizers from './sanitizers';
import * as validators from './validators';

export const V = validators;
export const S = sanitizers;

type CustomRuleChecker = (
  check: ValidationChain,
  fieldName: string
) => ValidationChain;

/**
 * use this interface and re-assign query/body function
 * so typescript can check if the passed `field` is vaid or not
 *
 * use original query/body if you need to pass wildcard (*) into `field`
 */
export interface GenericCheckFn<T> {
  (field: keyof T | (keyof T)[], rules?: CustomRuleChecker[]): ValidationChain;
  (
    field: keyof T | (keyof T)[],
    fieldName?: string,
    rules?: CustomRuleChecker[]
  ): ValidationChain;
}

/**
 * base validator function
 * @param checkType check from request body or request query
 * @param field field name to be checked
 * @param fieldNameJpOrRules set of rules or logical field name to display in error message
 * @param rules set of rules apply to field
 */
const validator = (
  checkType: 'body' | 'query',
  field: string | string[],
  fieldNameJpOrRules?: string | CustomRuleChecker[],
  rules?: CustomRuleChecker[]
) => {
  let check = b(field);
  if (checkType === 'query') {
    check = q(field);
  }

  let fieldName = '';
  let ruleSet: CustomRuleChecker[] | undefined = rules;
  if (typeof fieldNameJpOrRules === 'string') {
    fieldName = fieldNameJpOrRules;
  } else {
    ruleSet = fieldNameJpOrRules;
  }

  if (ruleSet !== undefined) {
    for (const rule of ruleSet) {
      check = rule(check, fieldName);
    }
  }

  return check;
};

/**
 * request body validator function
 * @param field field name to be checked
 * @param rules set of rules apply to field
 */
export function body(
  field: string | string[],
  rules?: CustomRuleChecker[]
): ValidationChain;

/**
 * request body validator function
 * @param field field name to be checked
 * @param fieldName logical field name to display in error message
 * @param rules set of rules apply to field
 */
export function body(
  field: string | string[],
  fieldName?: string,
  rules?: CustomRuleChecker[]
): ValidationChain;

export function body(
  field: string | string[],
  fieldNameJpOrRules?: string | CustomRuleChecker[],
  rules?: CustomRuleChecker[]
) {
  return validator('body', field, fieldNameJpOrRules, rules);
}

/**
 * request query validator function
 * @param field field name to be checked
 * @param rules set of rules apply to field
 */
export function query(
  field: string | string[],
  rules?: CustomRuleChecker[]
): ValidationChain;

/**
 * request query validator function
 * @param field field name to be checked
 * @param fieldName logical field name to display in error message
 * @param rules set of rules apply to field
 */
export function query(
  field: string | string[],
  fieldName?: string,
  rules?: CustomRuleChecker[]
): ValidationChain;

export function query(
  field: string | string[],
  fieldNameJpOrRules?: string | CustomRuleChecker[],
  rules?: CustomRuleChecker[]
) {
  return validator('query', field, fieldNameJpOrRules, rules);
}
