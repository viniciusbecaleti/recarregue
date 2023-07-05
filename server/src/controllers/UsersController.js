const AppError = require("../utils/AppError")
const validateEmail = require("../utils/validateEmail")
const knex = require("../database/knex")
const { hash } = require("bcrypt")
const { v4: uuid } = require("uuid")

class UsersController {
  async create(req, res) {
    const { email, password } = req.body

    if (!email) {
      throw new AppError("Email is required")
    }

    if (!password) {
      throw new AppError("Password is required")
    }

    const userAlreadyExists = await knex("users").select("*").where({ email }).first()

    if (userAlreadyExists) {
      throw new AppError("User already exists")
    }

    const hashedPassword = await hash(password, 10)

    const user = {
      id: uuid(),
      email: email.toLowerCase(),
      password: hashedPassword
    }

    await knex("users").insert(user)

    res.sendStatus(201)
  }

  async update(req, res) {
    console.log(req.user)
    res.json({ ok: "ok" })
  }
}

module.exports = UsersController
