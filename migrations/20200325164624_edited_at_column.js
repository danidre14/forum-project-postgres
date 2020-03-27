exports.up = async function (knex) {
    await knex.schema.table('users', (table) =>
        table.datetime('edited_at').defaultTo(knex.fn.now())
    );
    await knex.schema.table('posts', (table) =>
        table.datetime('edited_at').defaultTo(knex.fn.now())
    );
    await knex.schema.table('comments', (table) =>
        table.datetime('edited_at').defaultTo(knex.fn.now())
    );
};

exports.down = async function (knex) {
    await knex.schema.table("comments", (table) =>
        table.dropColumn('edited_at')
    );
    await knex.schema.table("posts", (table) =>
        table.dropColumn('edited_at')
    );
    await knex.schema.table("users", (table) =>
        table.dropColumn('edited_at')
    );
};
