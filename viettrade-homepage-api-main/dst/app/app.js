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
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const passport = require("passport");
const path = require("path");
const qs = require("qs");
const errorHandler_1 = require("./middlewares/errorHandler");
const notFoundHandler_1 = require("./middlewares/notFoundHandler");
const passport_1 = require("./passport");
const routes_1 = require("./routes");
const preLogin_1 = require("./routes/preLogin");
const sequelize_1 = require("./sequelize");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express();
        const sequelize = yield (0, sequelize_1.default)();
        // checkEnv();
        app.use(passport.initialize());
        app.set('query parser', (str) => qs.parse(str, {
            arrayLimit: 1000,
            parseArrays: true,
            allowDots: false,
            allowPrototypes: true
        }));
        const options = {
            origin: '*',
            allowedHeaders: [
                'Origin',
                'X-Requested-With',
                'Content-Type',
                'Accept',
                'X-Access-Token',
                'Authorization'
            ],
            credentials: false,
            methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
            preflightContinue: false,
            optionsSuccessStatus: 204
        };
        app.use(cors(options));
        app.use(helmet());
        app.use(helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"]
                // styleSrc: ['\'unsafe-inline\'']
            }
        }));
        const SIXTY_DAYS_IN_SECONDS = 5184000;
        app.use(helmet.hsts({
            maxAge: SIXTY_DAYS_IN_SECONDS,
            includeSubDomains: false
        }));
        // api version
        // tslint:disable-next-line:no-require-imports no-var-requires
        const packageInfo = require('../../package.json');
        app.use((__, res, next) => {
            res.setHeader('x-api-verion', packageInfo.version);
            next();
        });
        app.use(bodyParser.json({ limit: '1mb' }));
        app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
        app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));
        app.use('/v1/', (0, preLogin_1.default)(sequelize));
        passport.use((0, passport_1.strategy)());
        // routers
        app.use('/v1/', passport_1.jwtAuthenticate, (0, routes_1.default)(sequelize));
        app.use('/check/', (_, res) => {
            res.send('OK');
        });
        // 404
        app.use(notFoundHandler_1.default);
        // error handlers
        app.use(errorHandler_1.default);
        return { app };
    });
}
exports.default = default_1;
//# sourceMappingURL=app.js.map