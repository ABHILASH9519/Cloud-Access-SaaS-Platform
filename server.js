const express = require("express")
const cors = require("cors")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get("/", (req, res) => {
    res.send("SaaS Platform API Running 🚀")
})

// Import API routes
const authRoutes = require("./routes/authRoutes")

// Use routes
app.use("/api/auth", authRoutes)

// Port
const PORT = process.env.PORT || 5000

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
