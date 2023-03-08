"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * NotImplementedError
 */
class NotImplementedError extends error_1.default {
    constructor(message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Method is not yet implemented.';
        }
        super(_errorCode_1.default.NotImplemented, actualMessage, http_status_1.NOT_IMPLEMENTED);
        Object.assign(this, NotImplementedError.prototype);
    }
}
exports.default = NotImplementedError;
//# sourceMappingURL=notImplemented.js.map