require('dotenv').config();
const express = require('express');
const app = new express();
const parser = require('body-parser');
const passport = require('./config/passport');
const routes = require('./routes/auth/auth');
const api_routes = require('./routes/api/index');
app.use(passport.initialize());
app.use(parser.urlencoded({
  extended: false
}));
app.use(parser.json());
app.use(routes);
app.use(api_routes);

const PORT = process.env.PORT || 4000;
app.listen(PORT);