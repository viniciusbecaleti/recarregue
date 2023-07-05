exports.up = function(knex) {
  return knex.schema.createTable("users", table => {
    table.uuid("id").primary()
    table.string("first_name")
    table.string("last_name")
    table.string("phone")
    table.string("email").unique().notNullable()
    table.string("password").notNullable()
    table.boolean("admin").defaultTo(false)
    table.timestamp("created_at").defaultTo(knex.fn.now())
    table.timestamp("updated_at").defaultTo(knex.fn.now())
  })
}

exports.down = function(knex) {
  return knex.schema.dropTable("users")
}
