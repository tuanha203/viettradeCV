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
/**
 * sequelize
 */
const createDebug = require("debug");
const Sequelize = require("sequelize");
const domain_1 = require("../domain");
const debug = createDebug('api:sequelize');
const createClient = () => __awaiter(void 0, void 0, void 0, function* () {
    const connectInformation = {
        host: process.env.MYSQL_HOST,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        port: Number(process.env.MYSQL_PORT)
    };
    const sequelize = new Sequelize.Sequelize(process.env.MYSQL_DATABASE, null, null, {
        dialect: 'mysql',
        benchmark: true,
        // port: parseInt(<string>process.env.MYSQL_PORT, 10),
        logging: (logStr, time) => {
            debug(`${logStr} (took ${time}ms)`);
        },
        replication: {
            read: [connectInformation],
            write: connectInformation
        }
    });
    sequelize
        .authenticate()
        .then(() => {
        debug('MySQL server connected');
    })
        .catch((err) => {
        debug(`MySQL connection error ${err}`);
        process.exit();
    });
    // initialize all repo and export it
    return (0, domain_1.initialize)(sequelize);
});
exports.default = createClient;
//# sourceMappingURL=sequelize.js.map