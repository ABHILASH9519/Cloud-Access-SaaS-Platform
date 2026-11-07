const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Liveness probe for containers and deployment platforms.
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.get("/", (req, res) => {
  res.send("SaaS Platform API Running 🚀");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

if (require.main === module) {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
