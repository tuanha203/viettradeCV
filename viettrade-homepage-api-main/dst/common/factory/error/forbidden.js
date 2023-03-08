"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * ForbiddenError
 */
class ForbiddenError extends error_1.default {
    constructor(message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Forbidden.';
        }
        super(_errorCode_1.default.Forbidden, actualMessage, http_status_1.FORBIDDEN);
        Object.assign(this, ForbiddenError.prototype);
    }
}
exports.default = ForbiddenError;
//# sourceMappingURL=forbidden.js.map