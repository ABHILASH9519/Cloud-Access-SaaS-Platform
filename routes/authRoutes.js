const express = require("express");
const router = express.Router();

// Keep the path's casing aligned with authcontroller.js for Linux deployments.
const authController = require("../controllers/authcontroller");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
