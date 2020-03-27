const knex = require("../knex");

function getWheres(query, data) {
    if (data.constructor === Array) {
        if (typeof data[0] !== "object")
            query.where(...data);
        else
            for (const elem of data)
                if (elem.constructor === Array)
                    query.where(...elem);
                else if (elem.constructor === Object)
                    query.where(elem);
    } else if (data.constructor === Object)
        query.where(data);
    return query;
}

const Users = {
    async create(user) {
        const [theUser] = await knex("users").insert(user, "*");
        return theUser;
    },
    async update(data, user) {
        const edited_at = knex.fn.now();
        const [theUser] = await knex("users").where(data).update({ ...user, edited_at }, "*");
        return theUser;
    },
    delete(data) {
        return knex("users").where(data).del();
    },
    async findAll(data = {}, returns) {
        await knex.raw(`DELETE FROM users WHERE is_verified = false AND created_at < NOW() - INTERVAL '2 days';`);
        const user = getWheres(knex("users"), data).select(returns && typeof returns === "string" ? returns.split(" ") : "*");
        return user;
    },
    async findOne(data = {}, returns) {
        await knex.raw(`DELETE FROM users WHERE is_verified = false AND created_at < NOW() - INTERVAL '2 days';`);
        const user = getWheres(knex("users"), data).select(returns && typeof returns === "string" ? returns.split(" ") : "*").first();
        return user;
    }
}

module.exports = Users;