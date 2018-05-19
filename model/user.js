const db = require('../db');

const User = db.Model.extend({
  tableName: 'users',
  hasSecurePassword: true
});

module.exports = User;