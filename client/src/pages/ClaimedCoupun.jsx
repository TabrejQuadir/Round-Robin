import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchClaimedCoupons } from "../redux/coupunSlice";

const ClaimedCoupun = () => {
  const dispatch = useDispatch();
  const { claimedCoupons, loading, error } = useSelector((state) => state.coupon);

  useEffect(() => {
    dispatch(fetchClaimedCoupons());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <p className="text-2xl font-bold">⚠️ {error.message || "Something went wrong!"}</p>
      </div>
    );
  }

  if (!claimedCoupons || !claimedCoupons.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
        <p className="text-3xl font-semibold">🚀 No coupons have been claimed yet!</p>
        <p className="text-lg mt-2 opacity-80">Check back later to see new claimed coupons.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black mt-20 p-8 flex flex-col items-center">
      {/* Title with subtle glow effect */}
      <h1 className="text-5xl font-extrabold text-yellow-400 mb-10 text-center drop-shadow-lg">
        Claimed Coupons
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {claimedCoupons.map((coupon) => (
          <div
            key={coupon._id}
            className="relative bg-gradient-to-br from-yellow-500/30 to-yellow-900/40 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-yellow-500 transition-all duration-300 hover:scale-105 flex flex-col"
          >
            {/* Coupon Code with Glow Effect */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-yellow-300 text-2xl font-bold tracking-wide">{coupon.code}</span>
              <span className="text-gray-400 text-sm">
                {new Date().toLocaleDateString()}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-200 text-lg italic text-center mb-4">
              {coupon.description}
            </p>

            {/* Claimed By Section */}
            <div className="bg-black/40 p-4 rounded-lg backdrop-blur-lg shadow-md">
              <h3 className="text-yellow-300 text-lg font-semibold mb-2">Users Who Claimed:</h3>

              <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-700">
                {coupon.claimedBy.map((claim, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-900/50 p-3 rounded-lg mb-2 border border-gray-700"
                  >
                    <span className="text-yellow-400 text-sm">
                      🛡️ Session ID: <span className="font-semibold">{claim.user}</span>
                    </span>
                    <span className="text-gray-400 text-xs">
                      📅 {new Date(claim.lastClaimedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Glowing Border Effect */}
            <div className="absolute inset-0 border border-yellow-400 opacity-20 rounded-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClaimedCoupun;
