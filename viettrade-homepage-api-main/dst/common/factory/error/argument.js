"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * ArgumentError
 */
class ArgumentError extends error_1.default {
    constructor(argumentName, message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = `Invalid or missing argument supplied: ${argumentName}.`;
        }
        super(_errorCode_1.default.Argument, actualMessage, http_status_1.BAD_REQUEST);
        this.argumentName = argumentName;
        Object.assign(this, ArgumentError.prototype);
    }
}
exports.default = ArgumentError;
//# sourceMappingURL=argument.js.map