const AppError = require("../utils/AppError")
const knex = require("../database/knex")

async function ensureAdmin(req, res, next) {
  const { id: userId } = req.user

  const { admin } = await knex("users").select("*").where({ id: userId }).first()

  if (!admin) {
    throw new AppError("Permission denied", 403)
  }

  next()
}

module.exports = ensureAdmin
