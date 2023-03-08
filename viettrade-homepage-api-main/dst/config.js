"use strict";
require('dotenv').config();
module.exports = {
    development: {
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: 'mysql',
        dialectOptions: {
            multipleStatements: true
        }
    }
};
//# sourceMappingURL=config.js.map