const Coupon = require("../models/Coupon");

// CREATE A NEW COUPON (Admin Only)
exports.createCoupon = async (req, res) => {
  try {
    const { code, description } = req.body;

    // Check if coupon already exists
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) return res.status(400).json({ message: "Coupon code already exists" });

    // Create new coupon
    const newCoupon = new Coupon({ code, description });
    await newCoupon.save();

    res.status(201).json({ message: "Coupon created successfully", coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET ALL COUPONS (Admin Only)
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// TOGGLE COUPON ACTIVE/INACTIVE (Admin Only)
exports.toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findById(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    coupon.active = !coupon.active;
    await coupon.save();

    res.json({ message: "Coupon status updated", coupon });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// DELETE COUPON (Admin Only)
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await Coupon.findByIdAndDelete(id);
    res.json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
