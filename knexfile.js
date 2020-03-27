if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL_DEV
  },
  test: {
    client: "pg",
    connection: process.env.DATABASE_URL_TEST
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL
  },
  onUpdateTrigger: table => `
    CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
  `
};
