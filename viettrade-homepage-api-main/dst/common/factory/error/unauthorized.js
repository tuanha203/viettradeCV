"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * UnauthorizedError
 */
class UnauthorizedError extends error_1.default {
    constructor(message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Unauthorized.';
        }
        super(_errorCode_1.default.Unauthorized, actualMessage, http_status_1.UNAUTHORIZED);
        Object.assign(this, UnauthorizedError.prototype);
    }
}
exports.default = UnauthorizedError;
//# sourceMappingURL=unauthorized.js.map