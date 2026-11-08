require("dotenv").config();

const createApp = require("./lib/createApp");
const authRoutes = require("./routes/authRoutes");

const app = createApp({ authRoutes });

if (require.main === module) {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;
