"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constant_1 = require("../../constant");
/**
 * Error
 */
class BWError extends Error {
    constructor(code, message = constant_1.messages.systemError, httpStatus = 500) {
        super(message);
        this.name = 'Error';
        this.httpStatus = httpStatus;
        this.reason = code;
    }
}
exports.default = BWError;
//# sourceMappingURL=error.js.map