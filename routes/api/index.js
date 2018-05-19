var api = require('../../api/index');
var express = require('express');
var router = express.Router();
const passport = require('../../config/passport');
const jwtHelpers = require('../../config/jwt_helpers') 
// Public API
router.get('/api/home',api.displayHome);

// Authenticated API
router.get('/api/books',jwtHelpers.ensureAuthentication,api.getAllBooks);
router.get('/api/books/:id',jwtHelpers.ensureAuthentication,api.getSingleBook);

// Private API
router.put('/api/books/:id',jwtHelpers.ensureAuthorization,api.updateBook);
router.post('/api/books',jwtHelpers.ensureAuthorization,api.createBook);
router.delete('/api/books/:id',jwtHelpers.ensureAuthorization,api.removeBook);

module.exports = router;