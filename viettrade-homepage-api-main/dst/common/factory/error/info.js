"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = require("http-status");
const _errorCode_1 = require("./_errorCode");
const error_1 = require("./error");
/**
 * Info object / not a actual arror
 */
class Info extends error_1.default {
    constructor(argumentName, message) {
        const actualMessage = message;
        super(_errorCode_1.default.Argument, actualMessage, http_status_1.OK);
        this.argumentName = argumentName;
        Object.assign(this, Info.prototype);
    }
}
exports.default = Info;
//# sourceMappingURL=info.js.map