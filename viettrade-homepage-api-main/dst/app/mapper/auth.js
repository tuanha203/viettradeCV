"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactFormData = void 0;
const utils_1 = require("../utils");
const contactFormData = (req) => {
    return (0, utils_1.pick)(req.body, [
        'fullName',
        'phone',
        'email',
        'title',
        'content'
    ]);
};
exports.contactFormData = contactFormData;
//# sourceMappingURL=auth.js.map