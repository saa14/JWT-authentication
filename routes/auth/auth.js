const User = require('../../model/user');
const router = require('express').Router();
const passport = require('../../config/passport');
const jwt = require('jsonwebtoken');
const jwtHelpers = require('../../config/jwt_helpers') 
router.get('/api/user', passport.authenticate('jwt', { session: false }), (req, res) => {
  req_obj = req.user.attributes
  console.log(req_obj)
  return res.json({
    "id":req_obj.id,
  "email":req_obj.user_email
});
});

router.post('/api/register', (req, res, next) => {
  if (!req.body.email || !req.body.password) {
    return res.status(401).send('Wrong or No Fields');
  }

  const user = new User({
    user_email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });

  user.save().then(() => {
    res.status(200).json({
      status: 'success',
      token: jwtHelpers.encodeToken(user) 
    });
  });
});
router.post('/api/login', (req, res) => {
    if (!req.body.email || !req.body.password) {
      return res.status(401).send('Wrong or No Fields');
    }
    User.forge({ user_email: req.body.email }).fetch().then(result => {
      if (!result) {
        return res.status(400).send('User not found in the database');
      }

      result.authenticate(req.body.password).then(user => {
        // const payload = { id: user.id };
        const token = jwtHelpers.encodeToken(user) 
        // jwt.sign(payload, process.env.TOKEN_SECRET);
        res.send(token);
      }).catch(err => {
        return res.status(401).send({ err });
      });
    });
  }
);

// router.get('/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
//   res.send('Authenticated API');
// });


module.exports = router;