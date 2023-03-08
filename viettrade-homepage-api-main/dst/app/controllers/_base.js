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
const createDebug = require("debug");
const http_status_1 = require("http-status");
const requestIp = require("request-ip");
const debug = createDebug('api:controllers');
/**
 * base controller class for all other controller
 * contain common method and property
 */
class BaseController {
    constructor(db) {
        this.db = db;
    }
    /**
     * write access log
     *
     * @param req
     * @param extend
     */
    logClientInfo(req, param) {
        var _a;
        let info = {
            'user-ip': requestIp.getClientIp(req),
            'user-agent': req.headers['user-agent'],
            'user-id': (_a = req.user) === null || _a === void 0 ? void 0 : _a.id
        };
        info = Object.assign(Object.assign({}, info), param);
        debug('-----ACCESS LOG-----:', JSON.stringify(info));
    }
    ok(res, data) {
        if (data.count !== undefined) {
            res.setHeader('Access-Control-Expose-Headers', 'X-Total-Count');
            res.setHeader('X-Total-Count', data.count);
        }
        res.json(data.rows);
    }
    created(res, result) {
        if (result === undefined) {
            res.status(http_status_1.CREATED).send();
        }
        else {
            res.status(http_status_1.CREATED).json(result);
        }
    }
    noContent(res) {
        res.status(http_status_1.NO_CONTENT).send();
    }
    nextWrapper(mainFunction) {
        return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield mainFunction(req, res, next);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getOffsetLimit(req) {
        const page = Number(req.query.offset);
        const limit = Number(req.query.limit);
        if (!isNaN(limit) &&
            req.query.limit !== undefined &&
            req.query.limit !== null &&
            req.query.limit !== '') {
            if (!isNaN(page) && page > 0) {
                const offset = page * limit - limit;
                return { offset, limit };
            }
            else {
                return { offset: 0, limit };
            }
        }
        else {
            return { offset: 0, limit: '' };
        }
    }
}
exports.default = BaseController;
//# sourceMappingURL=_base.js.map