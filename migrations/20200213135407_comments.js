const { onUpdateTrigger } = require('../knexfile');

exports.up = async function (knex) {
    await knex.schema.createTable('comments', (table) => {
        table.increments('id');
        table.string("username", 64);
        table.string("body", 1024);
        table.integer('post_id').unsigned()
            .references('posts.id')
            .onUpdate('CASCADE')
            .onDelete('CASCADE')
        table.timestamps(true, true);
    });
    await knex.raw(onUpdateTrigger('comments'));
};

exports.down = async function (knex) {
    await knex.schema.table('comments', (table) => {
        table.dropForeign('post_id');
    })
    await knex.schema.dropTable("comments");
};
