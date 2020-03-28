const knex = require("../knex");

function getWheres(query, wheres) {
    if (wheres.constructor === Array) {
        if (typeof wheres[0] !== "object")
            query.where(...wheres);
        else
            for (const elem of wheres)
                if (elem.constructor === Array)
                    query.where(...elem);
                else if (elem.constructor === Object)
                    query.where(elem);
    } else if (wheres.constructor === Object)
        query.where(wheres);
    return query;
}

const Users = {
    async create(data) {
        const [theUser] = await knex("users").insert(data, "*");
        return theUser;
    },
    async update(wheres, data) {
        const edited_at = knex.fn.now();
        const [theUser] = await knex("users").where(wheres).update({ ...data, edited_at }, "*");
        return theUser;
    },
    delete(wheres) {
        return knex("users").where(wheres).del();
    },
    async findAll(wheres = {}, returns) {
        await knex.raw(`DELETE FROM users WHERE is_verified = false AND created_at < NOW() - INTERVAL '2 days';`);
        const user = getWheres(knex("users"), wheres).select(returns && typeof returns === "string" ? returns.split(" ") : "*");
        return user;
    },
    async findOne(wheres = {}, returns) {
        await knex.raw(`DELETE FROM users WHERE is_verified = false AND created_at < NOW() - INTERVAL '2 days';`);
        const user = getWheres(knex("users"), wheres).select(returns && typeof returns === "string" ? returns.split(" ") : "*").first();
        return user;
    }
}

module.exports = Users;