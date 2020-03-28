exports.up = async function (knex) {
    await knex.schema.table('posts', (table) => {
        table.integer('view_count').unsigned().notNull().defaultTo(0);
    });
};

exports.down = async function (knex) {
    await knex.schema.table("posts", (table) =>
        table.dropColumn('view_count')
    );
};
