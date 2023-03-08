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
exports.jwtAuthenticate = exports.strategy = void 0;
const passport = require("passport");
const passport_jwt_1 = require("passport-jwt");
// export const strategy = new JWTStrategy(opts, async (jwtPayload, done) => {
//   done(null, jwtPayload);
// });
const strategy = () => {
    const opts = {
        secretOrKey: process.env.JWT_SECRET || 'viettrade',
        jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('Bearer')
    };
    return new passport_jwt_1.Strategy(opts, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
        done(null, jwtPayload);
    }));
};
exports.strategy = strategy;
const jwtAuthenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {
        if (err) {
            next(err);
        }
        else if (!user) {
            next();
        }
        else {
            req.user = user;
            next();
        }
    })(req, res, next);
};
exports.jwtAuthenticate = jwtAuthenticate;
//# sourceMappingURL=passport.js.map