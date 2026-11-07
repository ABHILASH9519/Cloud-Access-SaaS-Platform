const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ValidationError, parseCredentials } = require("../lib/authValidation");

const prisma = new PrismaClient();

exports.register = async (req, res) => {
  let credentials;

  try {
    credentials = parseCredentials(req.body);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(400).json({ error: "Invalid request body." });
  }

  try {
    const hashedPassword = await bcrypt.hash(credentials.password, 10);
    const user = await prisma.user.create({
      data: {
        email: credentials.email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ id: user.id, email: user.email });
  } catch (error) {
    if (error && error.code === "P2002") {
      return res.status(409).json({ error: "An account with this email already exists." });
    }

    console.error("User registration failed:", error.message);
    return res.status(500).json({ error: "User registration failed." });
  }
};

exports.login = async (req, res) => {
  let credentials;

  try {
    credentials = parseCredentials(req.body);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(400).json({ error: "Invalid request body." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
    });

    const valid = user
      ? await bcrypt.compare(credentials.password, user.password)
      : false;

    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");
      return res.status(503).json({ error: "Authentication is temporarily unavailable." });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ error: "Login failed." });
  }
};
