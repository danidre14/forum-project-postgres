const knex = require("./knex");

module.exports.Posts = {
    create(post) {
        return knex("posts").insert(post, "*");
    },
    read(id) {
        return id ? knex("posts").where("id", id).first() : knex("posts");
    },
    update(id, post) {
        return knex("posts").where("id", id).update(post, "*");
    },
    delete(id) {
        return knex("posts").where("id", id).del();
    }
}

module.exports.Comments = {
    create(comment) {
        return knex("comments").insert(comment, "*");
    },
    read(id) {
        return id ? knex("comments").where({ id }).first() : knex("comments");
    },
    update(id, comment) {
        return knex("comments").where({ id }).update(comment, "*");
    },
    delete(id) {
        return knex("comments").where({ id }).del();
    },
    getFromPost(id) {
        return knex("comments").where("post_id", id);
    }
}

// reference: http://michaelavila.com/knex-querylab/