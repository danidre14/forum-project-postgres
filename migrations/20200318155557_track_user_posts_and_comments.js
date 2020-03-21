
exports.up = async function (knex, Promise) {
    // function that updates user stats
    await knex.raw(`
    CREATE OR REPLACE FUNCTION update_user_stats(user_id integer)
        RETURNS void
        LANGUAGE 'plpgsql'
    AS $BODY$
    DECLARE
        posts_count bigint;
        comments_count bigint;
    BEGIN
        EXECUTE
            'SELECT
                (SELECT Count(id) FROM "posts" WHERE posts.author_id = users.id),
                (SELECT Count(id) FROM "comments" WHERE comments.author_id = users.id)
            FROM users WHERE users.id = $1'
        USING user_id INTO posts_count, comments_count;

        EXECUTE
            'UPDATE users SET
                posts_count = $1,
                comments_count = $2
            WHERE users.id = $3'
        USING posts_count, comments_count, user_id;
    END
    $BODY$;
    `)
    // update on user post/comment
    await knex.raw(`
    CREATE OR REPLACE FUNCTION on_user_post_or_comment()
        RETURNS trigger
        LANGUAGE 'plpgsql'
    AS $BODY$
    BEGIN
        IF (TG_OP = 'INSERT') AND (NEW.author_id IS NOT NULL) THEN
            PERFORM update_user_stats(NEW.author_id);
        END IF;
        IF (TG_OP = 'DELETE') AND (OLD.author_id IS NOT NULL) THEN
            PERFORM update_user_stats(OLD.author_id);
        END IF;

        RETURN NULL;
    END
    $BODY$;
    `);

    await knex.raw(`
    CREATE TRIGGER user_post_trigger
        AFTER INSERT OR DELETE OR UPDATE
        ON posts
        FOR EACH ROW
        EXECUTE PROCEDURE on_user_post_or_comment();    
    `);

    await knex.raw(`
    CREATE TRIGGER user_comment_trigger
        AFTER INSERT OR DELETE OR UPDATE
        ON comments
        FOR EACH ROW
        EXECUTE PROCEDURE on_user_post_or_comment();    
    `);
};

exports.down = async function (knex, Promise) {
    await knex.raw(`
    DROP TRIGGER IF EXISTS user_comment_trigger ON comments;
    `);
    await knex.raw(`
    DROP TRIGGER IF EXISTS user_post_trigger ON posts;
    `);
    await knex.raw(`
    DROP FUNCTION IF EXISTS on_user_post_or_comment();
    `);
    await knex.raw(`
    DROP FUNCTION IF EXISTS update_user_stats(user_id integer);
    `);
};
