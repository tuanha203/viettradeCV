"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Info = exports.Unauthorized = exports.Error = exports.ServiceUnavailable = exports.RateLimitExceeded = exports.NotImplemented = exports.NotFound = exports.Forbidden = exports.ArgumentNull = exports.Argument = exports.AlreadyInUse = void 0;
/**
 * errors
 */
const alreadyInUse_1 = require("./alreadyInUse");
exports.AlreadyInUse = alreadyInUse_1.default;
const argument_1 = require("./argument");
exports.Argument = argument_1.default;
const argumentNull_1 = require("./argumentNull");
exports.ArgumentNull = argumentNull_1.default;
const error_1 = require("./error");
exports.Error = error_1.default;
const forbidden_1 = require("./forbidden");
exports.Forbidden = forbidden_1.default;
const info_1 = require("./info");
exports.Info = info_1.default;
const notFound_1 = require("./notFound");
exports.NotFound = notFound_1.default;
const notImplemented_1 = require("./notImplemented");
exports.NotImplemented = notImplemented_1.default;
const rateLimitExceeded_1 = require("./rateLimitExceeded");
exports.RateLimitExceeded = rateLimitExceeded_1.default;
const serviceUnavailable_1 = require("./serviceUnavailable");
exports.ServiceUnavailable = serviceUnavailable_1.default;
const unauthorized_1 = require("./unauthorized");
exports.Unauthorized = unauthorized_1.default;
//# sourceMappingURL=index.js.map