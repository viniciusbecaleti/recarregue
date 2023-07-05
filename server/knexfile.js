const path = require("path")

module.exports = {
  development: {
    client: "mysql2",
    connection: {
      host: "localhost",
      port: 3306,
      user: "root",
      password: "root",
      database: "recarregue"
    },
    migrations: {
      directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
    }
  },
  // production: {
  //   client: "mysql2",
  //   connection: {
  //     host: ,
  //     port: ,
  //     user: ,
  //     password: ,
  //     database:
  //   },
  //   migrations: {
  //     directory: path.resolve(__dirname, "src", "database", "knex", "migrations")
  //   }
  // },
}
