"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * ServiceUnavailableError
 */
class ServiceUnavailableError extends error_1.default {
    constructor(message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Service unavailable temporarily.';
        }
        super(_errorCode_1.default.ServiceUnavailable, actualMessage, http_status_1.SERVICE_UNAVAILABLE);
        Object.assign(this, ServiceUnavailableError.prototype);
    }
}
exports.default = ServiceUnavailableError;
//# sourceMappingURL=serviceUnavailable.js.map