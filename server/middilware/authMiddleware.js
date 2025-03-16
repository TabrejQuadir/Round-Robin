const jwt = require("jsonwebtoken");

// Middleware to verify if user is authenticated
const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access Denied. No token provided." });
  }

  // Extract token from "Bearer TOKEN"
  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token", error: err.message });
  }
};


// Middleware to check admin role
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin Access Required" });
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware
};
