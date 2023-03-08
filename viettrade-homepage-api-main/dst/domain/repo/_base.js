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
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
const common_1 = require("../../common");
/**
 * Base class for other repository
 * common function is inside this class
 */
class BaseRepository {
    constructor(db) {
        this.commonExclude = [];
        this.extraExclude = ['createdAt', 'updatedAt'];
        this.db = db;
    }
    setOffsetLimit(findOptions, option) {
        if (option !== undefined) {
            if (!isNaN(Number(option.offset)) && option.offset !== '') {
                findOptions.offset = Number(option.offset);
            }
            if (!isNaN(Number(option.limit)) && option.limit !== '') {
                findOptions.limit = Number(option.limit);
            }
        }
    }
    notFoundError(result, errorStr) {
        if (result === null ||
            (result instanceof Array && result[0] === 0) ||
            (result instanceof Array && result.length === 0) ||
            (typeof result === 'number' && result === 0)) {
            throw new common_1.errors.NotFound(errorStr);
        }
    }
    /**
     * checkForeignKey
     *
     * @param ids
     * @param table
     */
    checkForeignKey(ids, table, setting) {
        return __awaiter(this, void 0, void 0, function* () {
            const idList = (0, lodash_1.isArray)(ids)
                ? (0, lodash_1.filter)(ids, (t) => t !== undefined)
                : (0, lodash_1.isString)(ids) || (0, lodash_1.isNumber)(ids)
                    ? [ids]
                    : [];
            const idListObjects = yield table.findAll({
                where: {
                    id: {
                        [sequelize_1.Op.in]: (0, lodash_1.map)(idList)
                    }
                }
            });
            if (idListObjects.length !== idList.length) {
                throw new common_1.errors.Argument(setting.field, common_1.messages.notFoundParameterError(setting.msg));
            }
        });
    }
}
exports.default = BaseRepository;
//# sourceMappingURL=_base.js.map