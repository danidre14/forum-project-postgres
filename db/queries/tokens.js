const knex = require("../knex");

const Tokens = {
    async create(token) {
        const [theToken] = await knex("tokens").insert(token, "*");
        return theToken;
    },
    async update(data, token) {
        const [theToken] = await knex("tokens").where(data).update(token, "*");
        return theToken;
    },
    delete(data) {
        return knex("tokens").where(data).del();
    },
    async findAll(data = {}) {
        await knex.raw(`DELETE FROM tokens WHERE created_at < NOW() - INTERVAL '2 hours';`);
        const token = await knex("tokens").where(data);
        return token;
    },
    async findOne(data = {}) {
        await knex.raw(`DELETE FROM tokens WHERE created_at < NOW() - INTERVAL '2 hours';`);
        const token = await knex("tokens").where(data).first();
        return token;
    }
}

module.exports = Tokens;