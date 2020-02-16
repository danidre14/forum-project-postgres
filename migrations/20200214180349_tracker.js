
exports.up = async function (knex, Promise) {
    // function that updates comment stats
    await knex.raw(`
    CREATE OR REPLACE FUNCTION update_post_stats(post_id integer)
        RETURNS void
        LANGUAGE 'plpgsql'
    AS $BODY$
    DECLARE
        comment_count bigint;
    BEGIN
        EXECUTE
            'SELECT
                (SELECT Count(id) FROM "comments" WHERE comments.post_id = posts.id)
            FROM posts WHERE posts.id = $1'
        USING post_id INTO comment_count;

        EXECUTE
            'UPDATE posts SET
                comment_count = $1
            WHERE posts.id = $2'
        USING comment_count, post_id;
    END
    $BODY$;
    `)
    // update on comments
    await knex.raw(`
    CREATE OR REPLACE FUNCTION on_post_comment()
        RETURNS trigger
        LANGUAGE 'plpgsql'
    AS $BODY$
    BEGIN
        IF (TG_OP = 'INSERT') AND (NEW.post_id IS NOT NULL) THEN
            PERFORM update_post_stats(NEW.post_id);
        END IF;
        IF (TG_OP = 'DELETE') AND (OLD.post_id IS NOT NULL) THEN
            PERFORM update_post_stats(OLD.post_id);
        END IF;

        RETURN NULL;
    END
    $BODY$;
    `);

    await knex.raw(`
    CREATE TRIGGER post_comment_trigger
        AFTER INSERT OR DELETE OR UPDATE
        ON comments
        FOR EACH ROW
        EXECUTE PROCEDURE on_post_comment();    
    `);
};

exports.down = async function (knex, Promise) {
    await knex.raw(`
    DROP TRIGGER IF EXISTS post_comment_trigger ON comments;
    `);
    await knex.raw(`
    DROP FUNCTION IF EXISTS on_post_comment();
    `);
    await knex.raw(`
    DROP FUNCTION IF EXISTS update_post_stats(post_id integer);
    `);
};
