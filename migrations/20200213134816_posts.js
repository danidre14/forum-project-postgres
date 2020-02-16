const { onUpdateTrigger } = require('../knexfile');

exports.up = async function (knex) {
    await knex.schema.createTable('posts', (table) => {
        table.increments('id');
        table.string('username', 64);
        table.string('title', 256);
        table.string('body', 2048);
        table.integer('comment_count').unsigned();
        table.timestamps(true, true);
    });
    await knex.raw(onUpdateTrigger('posts'));
};

exports.down = async function (knex) {
    await knex.schema.dropTable("posts");
};
