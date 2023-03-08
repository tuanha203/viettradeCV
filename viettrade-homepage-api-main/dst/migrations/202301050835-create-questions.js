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
        return qi.createTable('questions', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: dataTypes.BIGINT.UNSIGNED
            },
            question_vi: {
                allowNull: false,
                type: dataTypes.TEXT()
            },
            answer_vi: {
                allowNull: false,
                type: dataTypes.TEXT()
            },
            question_en: {
                type: dataTypes.TEXT()
            },
            answern_en: {
                type: dataTypes.TEXT()
            },
            feature_document: {
                type: dataTypes.STRING(255)
            },
            display: {
                allowNull: false,
                type: dataTypes.INTEGER()
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
                type: dataTypes.DATE,
                defaultValue: null
            }
        });
    }),
    down: (qi) => qi.dropTable('questions')
};
//# sourceMappingURL=202301050835-create-questions.js.map