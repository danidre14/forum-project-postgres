const knex = require("../knex");

const Posts = {
    async create(data) {
        const [thePost] = await knex("posts").insert(data, "*");
        return thePost;
    },
    async read(wheres) {
        if (wheres) {
            return knex('posts').select('posts.*', { username: 'users.username' }).join('users', { 'users.id': 'posts.author_id' }).where(this.unAmbiguise(wheres, "posts")).first();
        } else {
            // const adminPosts = knex('posts').select('posts.*', { username: 'users.username' }).where('posts.author_id', 2).join('users', { 'users.id': 'posts.author_id' }).orderBy('id', 'asc');
            // const otherPosts = knex('posts').select('posts.*', { username: 'users.username' }).where('posts.author_id', '<>', 2).join('users', { 'users.id': 'posts.author_id' }).orderBy('id', 'desc');

            // return knex.union(adminPosts, true).unionAll(otherPosts, true);
            // return knex.raw('? union all ?', [adminPosts, otherPosts]);
            // const result = await knex.raw('? union all ?;', [adminPosts, otherPosts]);
            // return result.rows;
            // return adminPosts.unionAll([otherPosts], true);
            return knex('posts').select('posts.*', { username: 'users.username' }).join('users', { 'users.id': 'posts.author_id' }).orderBy('id', 'desc');
        }
        //knex("posts").where(wheres).first() : knex("posts").orderBy("id", "desc");
    },
    async update(wheres, data, incEdit) {
        const edited_at = knex.fn.now();
        const info = incEdit ? { ...data, edited_at } : data;
        const [thePost] = await knex("posts").where(wheres).update(info, "*");
        return thePost;
    },
    delete(wheres) {
        return knex("posts").where(wheres).del();
    },
    getHompage() {
        return knex('posts').select('posts.*', { username: 'users.username' }).where('posts.author_id', 2).join('users', { 'users.id': 'posts.author_id' }).orderBy('id', 'asc');
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