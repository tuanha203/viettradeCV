/**
 * sequelize
 */
import * as createDebug from 'debug';
import * as Sequelize from 'sequelize';

import { initialize } from '../domain';

const debug = createDebug('api:sequelize');

const createClient = async () => {
  const connectInformation = {
    host: process.env.MYSQL_HOST,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    port: Number(process.env.MYSQL_PORT)
  };

  const sequelize = new Sequelize.Sequelize(
    process.env.MYSQL_DATABASE!,
    <any>null,
    <any>null,
    {
      dialect: 'mysql',
      benchmark: true,
      // port: parseInt(<string>process.env.MYSQL_PORT, 10),
      logging: (logStr: string, time: number) => {
        debug(`${logStr} (took ${time}ms)`);
      },
      replication: {
        read: [connectInformation],
        write: connectInformation
      }
    }
  );

  sequelize
    .authenticate()
    .then(() => {
      debug('MySQL server connected');
    })
    .catch((err: any) => {
      debug(`MySQL connection error ${err}`);
      process.exit();
    });

  // initialize all repo and export it
  return initialize(sequelize);
};

export default createClient;
