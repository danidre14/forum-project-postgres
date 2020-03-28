const knex = require("../knex");

const Posts = {
    async create(data) {
        const [thePost] = await knex("posts").insert(data, "*");
        return thePost;
    },
    read(wheres) {
        if (wheres) {
            return knex('posts').select('posts.*', { username: 'users.username' }).join('users', { 'users.id': 'posts.author_id' }).where(this.unAmbiguise(wheres, "posts")).first();
        } else {
            const adminPosts = knex('posts').select('posts.*', { username: 'users.username' }).where('posts.author_id', 2).join('users', { 'users.id': 'posts.author_id' });
            const otherPosts = knex('posts').select('posts.*', { username: 'users.username' }).where('posts.author_id', '<>', 2).join('users', { 'users.id': 'posts.author_id' }).orderBy('id', 'desc');

            return adminPosts.unionAll([otherPosts]);
        }
        //knex('posts').select('posts.*', { username: 'users.username' }).join('users', { 'users.id': 'posts.author_id' }).orderBy('id', 'desc');
        //knex("posts").where(wheres).first() : knex("posts").orderBy("id", "desc");
    },
    async update(wheres, data) {
        const edited_at = knex.fn.now();
        const [thePost] = await knex("posts").where(wheres).update({ ...data, edited_at }, "*");
        return thePost;
    },
    delete(wheres) {
        return knex("posts").where(wheres).del();
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