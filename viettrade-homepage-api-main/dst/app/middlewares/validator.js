"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * バリデーターミドルウェア
 * リクエストのパラメータ(query strings or body parameters)に対するバリデーション
 */
const createDebug = require("debug");
const express_validator_1 = require("express-validator");
const http_status_1 = require("http-status");
const lodash_1 = require("lodash");
const locale_1 = require("../locale");
const i18n_1 = require("../utils/i18n");
const debug = createDebug('api');
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const localeService = new locale_1.default(i18n_1.default);
    const validatorResult = (0, express_validator_1.validationResult)(req);
    if (!validatorResult.isEmpty()) {
        const errors = (0, lodash_1.map)(validatorResult.array({ onlyFirstError: true }), (mappedError) => {
            if (typeof mappedError.msg === 'object') {
                return localeService.translateArrgs(mappedError.msg);
            }
            return mappedError.msg;
        });
        debug('validation result not empty...', errors);
        res.status(http_status_1.BAD_REQUEST).json({
            errors
        });
    }
    else {
        next();
    }
});
//# sourceMappingURL=validator.js.map