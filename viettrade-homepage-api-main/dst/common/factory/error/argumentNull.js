"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * ArgumentNullError
 */
class ArgumentNullError extends error_1.default {
    constructor(argumentName, message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = `Missing argument: ${argumentName}.`;
        }
        super(_errorCode_1.default.ArgumentNull, actualMessage, http_status_1.BAD_REQUEST);
        this.argumentName = argumentName;
        Object.assign(this, ArgumentNullError.prototype);
    }
}
exports.default = ArgumentNullError;
//# sourceMappingURL=argumentNull.js.map