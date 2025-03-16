const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  active: { type: Boolean, default: true },
  claimedBy: [
    {
      user: { type: String, required: true }, // Store user IP or session ID
      lastClaimedAt: { type: Date, default: Date.now } // Track claim timestamp
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Coupon", CouponSchema);
