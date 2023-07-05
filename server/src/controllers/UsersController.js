const AppError = require("../utils/AppError")
const knex = require("../database/knex")
const { hash, compare } = require("bcrypt")
const { v4: uuid } = require("uuid")
const validateEmail = require("../utils/validateEmail")

class UsersController {
  async index(req, res) {
    const { id: userId } = req.user

    const user = await knex("users").select("*").where({ id: userId }).first()

    res.json(user)
  }

  async create(req, res) {
    const { email, password, confirmPassword } = req.body

    if (!email) {
      throw new AppError("O e-mail é obrigatório")
    }

    if (!password) {
      throw new AppError("A senha é obrigatória")
    }

    if (!confirmPassword) {
      throw new AppError("Confirme sua senha")
    }

    if (password !== confirmPassword) {
      throw new AppError("A senha e a confirmação da senha não correspondem")
    }

    const isValidEmail = validateEmail(email)

    if (!isValidEmail) {
      throw new AppError("Email inválido")
    }

    const userAlreadyExists = await knex("users").select("*").where({ email }).first()

    if (userAlreadyExists) {
      throw new AppError("O email já está sendo usado")
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
    const { id: userId } = req.user

    const {
      firstName,
      lastName,
      phone,
      email,
      newPassword,
      confirmNewPassword,
      currentPassword,
    } = req.body

    const user = await knex("users").select("*").where({ id: userId }).first()

    if (firstName) {
      user.first_name = firstName
    }

    if (lastName) {
      user.last_name = lastName
    }

    if (phone) {
      const regex = /^[1-9]{2}9\d{8}$/

      const isValidPhone = regex.test(phone)

      if (!isValidPhone) {
        throw new AppError("Número de celular inválido")
      }

      user.phone = phone
    }

    if (email) {
      const isValidEmail = validateEmail(email)

      if (!isValidEmail) {
        throw new AppError("Email inválido")
      }

      const userByEmail = await knex("users").select("*").where({ email }).first()

      if (userByEmail && userByEmail.email !== user.email) {
        throw new AppError("O email já está sendo usado")
      }

      user.email = email
    }

    const matchedPassword = await compare(currentPassword, user.password)

    if (!matchedPassword) {
      throw new AppError("Senha atual inválida", 403)
    }

    if (newPassword && !confirmNewPassword) {
      throw new AppError("Confirme a nova senha")
    }

    if (confirmNewPassword && !newPassword) {
      throw new AppError("Informe a nova senha")
    }

    if (newPassword && confirmNewPassword) {
      const hashedNewPassword = await hash(newPassword, 10)

      user.password = hashedNewPassword
    }

    await knex("users").update(user).where({ id: userId })

    res.sendStatus(200)
  }
}

module.exports = UsersController
