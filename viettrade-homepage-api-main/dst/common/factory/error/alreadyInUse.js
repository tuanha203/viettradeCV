"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * AlreadyInUseError
 */
class AlreadyInUseError extends error_1.default {
    constructor(entityName, fieldNames, message) {
        let actualMessage = message;
        if (message === undefined || message.length === 0) {
            actualMessage = `The specified '${entityName}' value is already in use for: ${fieldNames.join(', ')}.`;
        }
        super(_errorCode_1.default.AlreadyInUse, actualMessage, http_status_1.CONFLICT);
        this.entityName = entityName;
        this.fieldNames = fieldNames;
        Object.assign(this, AlreadyInUseError.prototype);
    }
}
exports.default = AlreadyInUseError;
//# sourceMappingURL=alreadyInUse.js.map