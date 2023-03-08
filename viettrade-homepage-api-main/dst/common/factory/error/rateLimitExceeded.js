"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * RateLimitExceededError
 */
class RateLimitExceededError extends error_1.default {
    constructor(message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = 'Rate limit exceeded.';
        }
        super(_errorCode_1.default.RateLimitExceeded, actualMessage, http_status_1.TOO_MANY_REQUESTS);
        Object.assign(this, RateLimitExceededError.prototype);
    }
}
exports.default = RateLimitExceededError;
//# sourceMappingURL=rateLimitExceeded.js.map