const knex = require("./knex");

module.exports.Postss = {
    create(post) {
        return knex("posts").insert(post, "*");
    },
    read(data) {
        return data ?
            knex('posts').select('posts.*', { author: 'users.username' }).join('user', { 'users.id': 'posts.author_id' }).where(data).first() :
            knex('posts').select('posts.*', { author: 'users.username' }).join('user', { 'users.id': 'posts.author_id' }).orderBy('id', 'desc');

        //knex("posts").where(data).first() : knex("posts").orderBy("id", "desc");
    },
    update(data, post) {
        return knex("posts").where(data).update(post, "*");
    },
    delete(data) {
        return knex("posts").where(data).del();
    }
}

module.exports.Commentss = {
    create(comment) {
        return knex("comments").insert(comment, "*");
    },
    read(data) {
        return data ? knex("comments").where(data).first() : knex("comments");
    },
    update(data, comment) {
        return knex("comments").where(data).update(comment, "*");
    },
    delete(data) {
        return knex("comments").where(data).del();
    },
    getFromPost(data) {
        return knex("comments").where(data).orderBy("id", "desc").limit(8);
    }
}

module.exports.Userss = {
    create(comment) {
        return knex("comments").insert(comment, "*");
    },
    read(data) {
        return data ? knex("comments").where(data).first() : knex("comments");
    },
    update(data, comment) {
        return knex("comments").where(data).update(comment, "*");
    },
    delete(data) {
        return knex("comments").where(data).del();
    },
    getFromPost(data) {
        return knex("comments").where(data).orderBy("id", "desc").limit(8);
    }
}

// reference: http://michaelavila.com/knex-querylab/