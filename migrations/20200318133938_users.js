const { onUpdateTrigger } = require('../knexfile');

exports.up = async function (knex) {
    await knex.schema.createTable('users', (table) => {
        table.increments('id');
        table.string('username', 64);
        table.string('email', 256);
        table.string('password', 256);
        table.boolean('is_verified');
        table.integer('posts_count').unsigned();
        table.integer('comments_count').unsigned();
        table.timestamps(true, true);
    });
    await knex.raw(onUpdateTrigger('users'));

    await knex.schema.createTable('tokens', (table) => {
        table.increments('id');
        table.integer('user_id').unsigned()
            .references('users.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
        table.string('token', 256);
        table.string('purpose', 256);
        table.timestamps(true, true);
    });

    await knex.schema.table('posts', (table) => {
        table.dropColumn('username');
        table.integer('author_id').unsigned()
            .references('users.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });

    await knex.schema.table('comments', (table) => {
        table.dropColumn('username');
        table.integer('author_id').unsigned()
            .references('users.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });
};

exports.down = async function (knex) {
    await knex.schema.table('comments', (table) => {
        table.dropForeign('author_id');
        table.string("username", 64);
    });
    await knex.schema.table('posts', (table) => {
        table.dropForeign('author_id');
        table.string("username", 64);
    });
    await knex.schema.dropTable("tokens");
    await knex.schema.dropTable("users");
};
