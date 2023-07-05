const AppError = require("../utils/AppError")
const { jwt } = require("../configs/auth")
const { promisify } = require("util")
const verify = promisify(require("jsonwebtoken").verify)

async function ensureAuthentication(req, res, next) {
  const { authorization } = req.headers

  if (!authorization) {
    throw new AppError("You need to be authenticated", 401)
  }

  const [, token] = authorization.split(" ")

  try {
    const { user } = await verify(token, jwt.secret)

    req.user = user

    next()
  } catch (error) {
    throw new AppError("Invalid JWT token")
  }
}

module.exports = ensureAuthentication
