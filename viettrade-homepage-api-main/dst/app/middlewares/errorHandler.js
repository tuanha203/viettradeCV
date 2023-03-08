"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createDebug = require("debug");
const http_status_1 = require("http-status");
const lodash_1 = require("lodash");
const Sequelize = require("sequelize");
const common_1 = require("../../common");
const debug = createDebug('api:middlewares:errorHandler');
exports.default = (err, req, res, next) => {
    debug(err);
    if (res.headersSent) {
        next(err);
        return;
    }
    const errorArr = [];
    if (err instanceof Sequelize.ValidationError) {
        res.status(http_status_1.BAD_REQUEST).json({
            errors: (0, lodash_1.map)(err.errors, 'message')
        });
    }
    else if (err instanceof Array && typeof err[0] === 'string') {
        res.status(http_status_1.BAD_REQUEST).json({ errors: err });
    }
    else {
        let responseError = err;
        if (err instanceof Sequelize.ForeignKeyConstraintError) {
            responseError = new common_1.errors.Argument(err.fields[0], common_1.messages.notFoundParameterError((0, lodash_1.get)(req, `locals.${err.fields[0]}`) || ''));
        }
        else if (!(err instanceof common_1.errors.Error)) {
            responseError = new common_1.errors.Error('InternalServerError', err.message);
        }
        if (responseError.httpStatus === 400 || responseError.httpStatus === 404) {
            res.status(responseError.httpStatus).json({
                errors: [responseError.message]
            });
        }
        else if (responseError.httpStatus === 401) {
            res.status(responseError.httpStatus).json({
                errors: ['Authentication error']
            });
        }
        else {
            errorArr.push(responseError.message);
            res.status(responseError.httpStatus).json({
                errors: errorArr
            });
        }
    }
};
//# sourceMappingURL=errorHandler.js.map