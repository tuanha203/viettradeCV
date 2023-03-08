"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = {
    up: (qi, dataTypes) => __awaiter(void 0, void 0, void 0, function* () {
        return qi.createTable('admin', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: dataTypes.BIGINT.UNSIGNED
            },
            role: {
                allowNull: false,
                type: dataTypes.TINYINT.UNSIGNED
            },
            name: {
                allowNull: false,
                type: dataTypes.STRING(50)
            },
            email: {
                allowNull: false,
                type: dataTypes.STRING(50)
            },
            password: {
                allowNull: false,
                type: dataTypes.STRING(255)
            },
            salt: {
                allowNull: false,
                type: dataTypes.STRING(10)
            },
            status: {
                allowNull: false,
                type: dataTypes.TINYINT.UNSIGNED
            },
            emailConfirmedAt: {
                type: dataTypes.DATE
            },
            lastLoginAt: {
                type: dataTypes.DATE
            },
            feature_image: {
                type: dataTypes.STRING
            },
            createdAt: {
                allowNull: false,
                type: dataTypes.DATE,
                defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: dataTypes.DATE,
                defaultValue: (0, sequelize_1.literal)('CURRENT_TIMESTAMP')
            },
            deletedAt: {
                allowNull: true,
                type: dataTypes.DATE,
                defaultValue: null
            }
        });
    }),
    down: (qi) => qi.dropTable('admin')
};
//# sourceMappingURL=202011161101-create-admin.js.map