
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users',t => {
        t.increments('id').unsigned().primary();
        t.string('user_email').notNull();
        t.string('role').notNull().defaultTo('USER');
        t.string('password_digest').notNull();

    });
  
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
  
};
