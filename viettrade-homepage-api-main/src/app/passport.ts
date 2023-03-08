/**
 * PASSPORT MIDDLEWARE
 */
import { NextFunction, Request, Response } from 'express';
import * as passport from 'passport';
import {
  ExtractJwt,
  Strategy as JWTStrategy,
  StrategyOptions
} from 'passport-jwt';

// export const strategy = new JWTStrategy(opts, async (jwtPayload, done) => {
//   done(null, jwtPayload);
// });

export const strategy = () => {
  const opts: StrategyOptions = {
    secretOrKey: process.env.JWT_SECRET || 'viettrade',
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer')
  };

  return new JWTStrategy(opts, async (jwtPayload, done) => {
    done(null, jwtPayload);
  });
};

export const jwtAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
    if (err) {
      next(err);
    } else if (!user) {
      next();
    } else {
      req.user = user;
      next();
    }
  })(req, res, next);
};
