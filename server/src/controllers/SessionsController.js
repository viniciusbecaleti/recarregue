const knex = require("../database/knex")
const AppError = require("../utils/AppError")
const { compare } = require("bcrypt")
const { jwt } = require("../configs/auth")
const { promisify } = require("util")
const sign = promisify(require("jsonwebtoken").sign)

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body

    if (!email) {
      throw new AppError("Email is required")
    }

    if (!password) {
      throw new AppError("Password is required")
    }

    const user = await knex("users").select("*").where({ email }).first()

    if (!user) {
      throw new AppError("User not found", 404)
    }

    const matchedPassword = await compare(password, user.password)

    if (!matchedPassword) {
      throw new AppError("Invalid password", 403)
    }

    const token = await sign({
      user: {
        id: user.id
      }
    }, jwt.secret, { expiresIn: jwt.expiresIn })

    res.json({ token })
  }
}

module.exports = SessionsController
