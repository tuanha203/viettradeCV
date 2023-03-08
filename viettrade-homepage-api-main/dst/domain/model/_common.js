"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonFields = void 0;
const sequelize_1 = require("sequelize");
const commonFields = (dt) => ({
    createdAt: {
        allowNull: false,
        type: dt.DATE,
        defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        allowNull: false,
        type: dt.DATE,
        defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP')
    },
    deletedAt: {
        type: dt.DATE,
        defaultValue: null
    }
});
exports.commonFields = commonFields;
//# sourceMappingURL=_common.js.map