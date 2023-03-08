/**
 * Module dependencies.
 */

const startTime = process.hrtime();

import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import * as http from 'http';

import createApp from './app/app';

dotenv.config();
/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: any) {
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
const port = normalizePort(
  process.env.PORT === undefined ? '8081' : process.env.PORT
);

createApp().then(async ({ app }) => {
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

  function onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind =
      typeof port === 'string'
        ? `Pipe ${port}`
        : `Port ${(<number>port).toString()}`;

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
    const bind =
      typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr!.port.toString()}`;
    console.log(`Listening on ${bind}`);

    const diff = process.hrtime(startTime);
    console.log(
      `api server listening took ${diff[0]} seconds and ${diff[1]} nanoseconds.`
    );
  }
});
