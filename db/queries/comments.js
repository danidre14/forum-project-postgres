const knex = require("../knex");

const Comments = {
    async create(comment) {
        const [theComment] = await knex("comments").insert(comment, "*");
        return theComment;
    },
    read(data) {
        return data ?
            knex('comments').select('comments.*', { username: 'users.username' }).join('users', { 'users.id': 'comments.author_id' }).where(this.unAmbiguise(data, "comments")).first() :
            knex('comments').select('comments.*', { username: 'users.username' }).join('users', { 'users.id': 'comments.author_id' });

        //knex("comments").where(data).first() : knex("comments");
        //knex("posts").where(data).first() : knex("posts").orderBy("id", "desc");
    },
    async update(data, comment) {
        const [theComment] = await knex("comments").where(data).update(comment, "*");
        return theComment;
    },
    delete(data) {
        return knex("comments").where(data).del();
    },
    getFromPost(data) {
        return knex("comments").select('comments.*', { username: 'users.username' }).join('users', { 'users.id': 'comments.author_id' }).where(this.unAmbiguise(data, "comments")).orderBy("id", "desc").limit(8);
    },
    unAmbiguise(obj, name) {
        const newObj = {};
        for (const i in obj) {
            newObj[`${name}.${i}`] = obj[i];
        }
        return newObj;
    }
}

module.exports = Comments;