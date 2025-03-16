const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const couponRoutes = require("./routes/couponRoutes");
const userCouponRoutes = require("./routes/userCouponRoutes");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Allows parsing JSON requests
app.use(cors({ origin: ["http://localhost:5173", "https://roundrobin-y25v.onrender.com"], credentials: true, allowedHeaders: ["Content-Type", "Authorization"], exposedHeaders: ["Set-Cookie"] }));
app.use(cookieParser()); // Enables cookies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Simple Test Route
app.get("/", (req, res) => {
  res.send("🎉 Server is Running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/user-coupons", userCouponRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));