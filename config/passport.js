
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import prisma from "../lib/prisma.js";

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "jakaza";

// Write test for this function
passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
        prisma.user.findUnique({ where: { id: jwt_payload.id } })
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(err => {
                return done(err, false);
            });
    })
);

export default async app => {
  app.use(passport.initialize());
  app.use(passport.initialize());

}