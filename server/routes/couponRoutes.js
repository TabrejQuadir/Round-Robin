const express = require("express");
const { createCoupon, getAllCoupons, toggleCouponStatus, deleteCoupon } = require("../controllers/couponController");
const { authMiddleware, adminMiddleware } = require("../middilware/authMiddleware");

const router = express.Router();

// Admin Routes (Protected)
router.post("/", authMiddleware, adminMiddleware, createCoupon); // Add new coupon
router.get("/",  getAllCoupons); // View all coupons
router.put("/:id/toggle", authMiddleware, adminMiddleware, toggleCouponStatus); // Toggle coupon status
router.delete("/:id", authMiddleware, adminMiddleware, deleteCoupon); // Delete coupon

module.exports = router;
