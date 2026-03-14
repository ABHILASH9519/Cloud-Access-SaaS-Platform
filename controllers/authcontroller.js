const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const prisma = new PrismaClient()

exports.register = async (req, res) => {

  const { email, password } = req.body

  try {

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })

    res.json({
      id: user.id,
      email: user.email
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "User registration failed" })
  }
}

exports.login = async (req, res) => {

  const { email, password } = req.body

  try {

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ message: "User not found" })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json({ message: "Invalid password" })
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({ token })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Login failed" })
  }
}
