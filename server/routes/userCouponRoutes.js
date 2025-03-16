const express = require("express");
const { claimCoupon, claimedCoupon } = require("../controllers/userCouponController");

const router = express.Router();

// User Route to Claim Coupon (No Auth Required)
router.post("/claim", claimCoupon);
router.get("/claimedcoupuns", claimedCoupon);

module.exports = router;
