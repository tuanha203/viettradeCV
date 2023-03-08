import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as passport from 'passport';
import path = require('path');
import * as qs from 'qs';

import errorHandler from './middlewares/errorHandler';
import notFoundHandler from './middlewares/notFoundHandler';
import { jwtAuthenticate, strategy } from './passport';
import router from './routes';
import authRoute from './routes/preLogin';
import createClient from './sequelize';

export default async function() {
  const app = express();
  const sequelize = await createClient();

  // checkEnv();
  app.use(passport.initialize());
  app.set('query parser', (str: any) =>
    qs.parse(str, {
      arrayLimit: 1000,
      parseArrays: true,
      allowDots: false,
      allowPrototypes: true
    })
  );

  const options: cors.CorsOptions = {
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
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"]
        // styleSrc: ['\'unsafe-inline\'']
      }
    })
  );

  const SIXTY_DAYS_IN_SECONDS = 5184000;
  app.use(
    helmet.hsts({
      maxAge: SIXTY_DAYS_IN_SECONDS,
      includeSubDomains: false
    })
  );

  // api version
  // tslint:disable-next-line:no-require-imports no-var-requires
  const packageInfo = require('../../package.json');
  app.use((__, res, next) => {
    res.setHeader('x-api-verion', <string>packageInfo.version);
    next();
  });

  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

  app.use(
    '/public',
    express.static(path.join(__dirname, '..', '..', 'public'))
  );

  app.use('/v1/', authRoute(sequelize));

  passport.use(strategy());

  // routers
  app.use('/v1/', jwtAuthenticate, router(sequelize));

  app.use('/check/', (_, res) => {
    res.send('OK');
  });

  // 404
  app.use(notFoundHandler);

  // error handlers
  app.use(errorHandler);

  return { app };
}
