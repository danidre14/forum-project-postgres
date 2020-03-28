const knex = require("../knex");

const Tokens = {
    async create(data) {
        const [theToken] = await knex("tokens").insert(data, "*");
        return theToken;
    },
    async update(wheres, data) {
        const [theToken] = await knex("tokens").where(wheres).update(data, "*");
        return theToken;
    },
    delete(wheres) {
        return knex("tokens").where(wheres).del();
    },
    async findAll(wheres = {}) {
        await knex.raw(`DELETE FROM tokens WHERE created_at < NOW() - INTERVAL '2 hours';`);
        const token = await knex("tokens").where(wheres);
        return token;
    },
    async findOne(wheres = {}) {
        await knex.raw(`DELETE FROM tokens WHERE created_at < NOW() - INTERVAL '2 hours';`);
        const token = await knex("tokens").where(wheres).first();
        return token;
    }
}

module.exports = Tokens;