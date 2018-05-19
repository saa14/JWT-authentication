const passport = require('passport');
const passportJWT = require('passport-jwt');
const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;
const User = require('../model/user');
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_SECRET
};

const strategy = new JwtStrategy(opts, (payload, next) => {
    User.forge({
        id: payload.id
    }).fetch().then(res => {
        next(null, res);
    }).catch((err) => {
        res.status(500).json({
            status: 'error'
        });
    });
});

passport.use(strategy);

module.exports = passport;