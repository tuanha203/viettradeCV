"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../../common");
exports.default = (req, __, next) => {
    next(new common_1.errors.NotFound(`router for [${req.path}]`));
};
//# sourceMappingURL=notFoundHandler.js.map