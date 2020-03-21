const knex = require("../knex");

const Users = {
    async create(user) {
        const [theUser] = await knex("users").insert(user, "*");
        return theUser;
    },
    read(data) {
        return data ? knex("users").where(data).first() : knex("users");
    },
    async update(data, user) {
        const [theUser] = await knex("users").where(data).update(user, "*");
        return theUser;
    },
    delete(data) {
        return knex("users").where(data).del();
    },
    findOne(data, returns) {
        return knex("users").select(returns && typeof returns === "string" ? returns.split(" ") : "*").where(data).first();
    },
    findOneByArray(data, returns) {
        return knex("users").select(returns && typeof returns === "string" ? returns.split(" ") : "*").where(...data).first();
    },
    findTokenMatchesAccount(id, username, email, returns) {
        return knex("users").select(returns && typeof returns === "string" ? returns.split(" ") : "*").where(...id).where(...username).where(...email).first();
    }
}

module.exports = Users;