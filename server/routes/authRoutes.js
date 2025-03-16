const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");

const router = express.Router();

// Routes for Authentication
router.post("/register", registerUser);
router.post("/login", loginUser);

// ✅ Logout Route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = router;
