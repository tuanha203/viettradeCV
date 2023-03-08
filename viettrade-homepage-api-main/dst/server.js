"use strict";
/**
 * Module dependencies.
 */
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
const startTime = process.hrtime();
const dotenv = require("dotenv"); // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
const http = require("http");
const app_1 = require("./app/app");
dotenv.config();
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    // tslint:disable-next-line:no-magic-numbers
    const portNumber = parseInt(val, 10);
    if (isNaN(portNumber)) {
        // named pipe
        return val;
    }
    if (portNumber >= 0) {
        // port number
        return portNumber;
    }
    return false;
}
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT === undefined ? '8081' : process.env.PORT);
(0, app_1.default)().then(({ app }) => __awaiter(void 0, void 0, void 0, function* () {
    app.set('port', port);
    /**
     * Create HTTP server.
     */
    const server = http.createServer(app);
    server.timeout = 1200000; // 1200s
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
    /**
     * Event listener for HTTP server 'error' event.
     */
    function onError(error) {
        if (error.syscall !== 'listen') {
            throw error;
        }
        const bind = typeof port === 'string'
            ? `Pipe ${port}`
            : `Port ${port.toString()}`;
        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
            default:
                throw error;
        }
    }
    /**
     * Event listener for HTTP server 'listening' event.
     */
    function onListening() {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? `pipe ${addr}`
            : `port ${addr.port.toString()}`;
        console.log(`Listening on ${bind}`);
        const diff = process.hrtime(startTime);
        console.log(`api server listening took ${diff[0]} seconds and ${diff[1]} nanoseconds.`);
    }
}));
//# sourceMappingURL=server.js.map