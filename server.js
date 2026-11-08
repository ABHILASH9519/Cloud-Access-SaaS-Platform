const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Set CORS_ORIGINS to a comma-separated allowlist in deployed environments.
// Requests without an Origin header remain supported for server-to-server clients.
const allowedOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  })
);
app.use(express.json({ limit: "32kb" }));

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
