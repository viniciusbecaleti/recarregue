require("express-async-errors")
require("dotenv").config()
const express = require("express")
const routes = require("./routes")
const AppError = require("./utils/AppError")

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)
app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message
    })
  }

  console.log(error)

  return res.status(500).json({
    status: "error",
    message: "Internal Server Error"
  })
})

const port = 3000
app.listen(port, () => console.log(`Server listening on http://localhost:${port}`))
