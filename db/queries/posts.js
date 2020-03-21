const knex = require("../knex");

const Posts = {
    async create(post) {
        const [thePost] = await knex("posts").insert(post, "*");
        return thePost;
    },
    read(data) {
        return data ?
            knex('posts').select('posts.*', { username: 'users.username' }).join('users', { 'users.id': 'posts.author_id' }).where(this.unAmbiguise(data, "posts")).first() :
            knex('posts').select('posts.*', { username: 'users.username' }).join('users', { 'users.id': 'posts.author_id' }).orderBy('id', 'desc');

        //knex("posts").where(data).first() : knex("posts").orderBy("id", "desc");
    },
    async update(data, post) {
        const [thePost] = await knex("posts").where(data).update(post, "*");
        return thePost;
    },
    delete(data) {
        return knex("posts").where(data).del();
    },
    unAmbiguise(obj, name) {
        const newObj = {};
        for (const i in obj) {
            newObj[`${name}.${i}`] = obj[i];
        }
        return newObj;
    }
}

module.exports = Posts;