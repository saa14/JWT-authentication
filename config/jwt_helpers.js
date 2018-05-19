const moment = require('moment');
const jwt = require('jwt-simple');
const knex = require('knex');
const knexDb = knex({ client: 'pg', connection: 'postgres://localhost:5432/jwt_auth' });

function encodeToken(user) {
    console.log(user);
    const playload = {
        exp: moment().add(14, 'days').unix(),
        iat: moment().unix(),
        sub: user.attributes.user_email
    };
    return jwt.encode(playload, process.env.TOKEN_SECRET);
}

function decodeToken(token, callback) {
    const payload = jwt.decode(token, process.env.TOKEN_SECRET);
    const now = moment().unix();
    // Check if the token has expired
    if (now > payload.exp) callback('Token has expired.');
    else callback(null, payload);
}

function ensureAuthorization(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({
            status: 'Please log in'
        });
    }
    // Token Decoding
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    decodeToken(token, (err, payload) => {
        if (err) {
            return res.status(401).json({
                status: 'Token has expired'
            });
        } else {
            // Check if the user still exists in DB
            console.log(payload)
            return knexDb.raw('select * from users where user_email = :email',{ email:payload.sub})
                .then((user) => {
                    console.log(user);
                    if(user.rows[0].role == 'ADMIN')
                    next();
                    else
                    res.status(401).json({
                        status: 'User does not have the priviliges to carry out this action'
                    });
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 'error'
                    });
                });
        }
    });
}
function ensureAuthentication(req, res, next) {
    if (!(req.headers && req.headers.authorization)) {
        return res.status(400).json({
            status: 'Please log in'
        });
    }
    // Token Decoding
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    decodeToken(token, (err, payload) => {
        if (err) {
            return res.status(401).json({
                status: 'Token has expired'
            });
        } else {
            // Check if the user still exists in DB
            console.log(payload)
            return knexDb.raw('select * from users where user_email = :email',{ email:payload.sub})
                .then((user) => {
                    console.log(user);
                    next();
                })
                .catch((err) => {
                    res.status(500).json({
                        status: 'error'
                    });
                });
        }
    });
}

module.exports = {
    encodeToken,
    decodeToken,
    ensureAuthorization,
    ensureAuthentication
};