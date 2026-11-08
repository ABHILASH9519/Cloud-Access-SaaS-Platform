const express = require("express");
const cors = require("cors");

function createApp({ authRoutes } = {}) {
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

  app.get("/healthz", (req, res) => {
    res.status(200).json({ status: "ok" });
  });

  app.get("/", (req, res) => {
    res.send("SaaS Platform API Running");
  });

  if (authRoutes) {
    app.use("/api/auth", authRoutes);
  }

  return app;
}

module.exports = createApp;
