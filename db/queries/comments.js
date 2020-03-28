const knex = require("../knex");

const Comments = {
    async create(data) {
        const [theComment] = await knex("comments").insert(data, "*");
        return theComment;
    },
    read(wheres) {
        return wheres ?
            knex('comments').select('comments.*', { username: 'users.username' }).join('users', { 'users.id': 'comments.author_id' }).where(this.unAmbiguise(wheres, "comments")).first() :
            knex('comments').select('comments.*', { username: 'users.username' }).join('users', { 'users.id': 'comments.author_id' });

        //knex("comments").where(wheres).first() : knex("comments");
        //knex("posts").where(wheres).first() : knex("posts").orderBy("id", "desc");
    },
    async update(wheres, data) {
        const edited_at = knex.fn.now();
        const [theComment] = await knex("comments").where(wheres).update({ ...data, edited_at }, "*");
        return theComment;
    },
    delete(wheres) {
        return knex("comments").where(wheres).del();
    },
    getFromPost(wheres) {
        return knex("comments").select('comments.*', { username: 'users.username' }).join('users', { 'users.id': 'comments.author_id' }).where(this.unAmbiguise(wheres, "comments")).orderBy("id", "desc").limit(8);
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