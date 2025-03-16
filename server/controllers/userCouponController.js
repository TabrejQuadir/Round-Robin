const Coupon = require("../models/Coupon");

const getUserIP = (req) => {
  // Get the x-forwarded-for header
  const xForwardedFor = req.headers["x-forwarded-for"];

  // If x-forwarded-for exists, extract the first IP (client IP)
  const clientIP = xForwardedFor
    ? xForwardedFor.split(",")[0].trim() // Split by comma and take the first IP
    : req.socket.remoteAddress; // Fallback to remoteAddress

  // Normalize IPv6 addresses (e.g., "::ffff:127.0.0.1" => "127.0.0.1")
  return clientIP.includes("::ffff:")
    ? clientIP.split("::ffff:")[1]
    : clientIP;
};

// CLAIM A COUPON (ROUND-ROBIN SYSTEM + ABUSE PREVENTION)
exports.claimCoupon = async (req, res) => {
  try {
    const userIP = getUserIP(req);
    const userSession = req.cookies.sessionId || userIP;
    const { couponId } = req.body; // Get coupon ID from request body

    console.log("User Session:", userSession); // Debugging

    if (!userSession) {
      return res.status(400).json({ message: "User session is missing" });
    }
    console.log("User Session:", userSession); // Debugging

    if (!couponId) {
      return res.status(400).json({ message: "Coupon ID is required" });
    }

    const recentlyClaimed = await Coupon.findOne({
      "claimedBy.user": userSession,
      "claimedBy.lastClaimedAt": { $gte: new Date(Date.now() - 15 * 60 * 1000) },
    });

    if (recentlyClaimed) {
      return res.status(429).json({ message: "You can only claim a coupon once every 15 minutes." });
    }

    // Find the specific coupon by ID
    const coupon = await Coupon.findById(couponId);

    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (!coupon.active) {
      return res.status(400).json({ message: "Coupon is not active" });
    }

    // Check if user has already claimed this coupon
    if (coupon.claimedBy.some(claim => claim.user === userSession)) {
      return res.status(400).json({ message: "You have already claimed this coupon" });
    }

    // Ensure we're pushing a valid object into `claimedBy`
    coupon.claimedBy.push({ user: userSession, lastClaimedAt: new Date() });

    await coupon.save();

    // Set a cookie to track this user’s claim
    res.cookie("sessionId", userSession, {
      httpOnly: false,
      secure: false, // Corrected for localhost HTTP
      sameSite: 'lax', // Or 'strict'
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: "Coupon claimed successfully!", coupon });
  } catch (err) {
    console.error(" Error in claimCoupon:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

// GET ONLY CLAIMED COUPONS & USERS WHO CLAIMED THEM
exports.claimedCoupon = async (req, res) => {
  try {
    // Fetch all coupons that have been claimed by any user
    const claimedCoupons = await Coupon.find(
      { "claimedBy.0": { $exists: true } }, // Ensure the array is not empty
      { code: 1, description: 1, claimedBy: 1, _id: 1 } // Return only necessary fields
    );

    if (!claimedCoupons.length) {
      return res.status(404).json({ message: "No coupons have been claimed yet." });
    }

    // Format the response to show only claimed coupons and users who claimed them
    const formattedCoupons = claimedCoupons.map(coupon => ({
      _id: coupon._id,
      code: coupon.code,
      description: coupon.description,
      claimedBy: coupon.claimedBy.map(claim => ({
        user: claim.user, 
        lastClaimedAt: claim.lastClaimedAt
      }))
    }));

    res.json({ message: "Claimed coupons fetched successfully!", claimedCoupons: formattedCoupons });
  } catch (err) {
    console.error("❌ Error in claimedCoupon:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};
