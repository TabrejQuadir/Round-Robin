import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { claimCoupon, setError } from "../redux/coupunSlice";
import Cookies from "js-cookie";
import { fetchCoupons } from "../redux/coupunSlice";

const Coupons = () => {
    const dispatch = useDispatch();
    const couponState = useSelector((state) => state.coupon);
    const { coupons, loading, error, shouldRefetch } = couponState;
    const sessionId = Cookies.get("sessionId");
    const [message, setMessage] = useState("");

    useEffect(() => {
        console.log(shouldRefetch, "shouldRefetch");
        if (shouldRefetch || !coupons.length) {
            console.log("fetchCoupons dispatched");
            dispatch(fetchCoupons());
        }
    }, [dispatch, shouldRefetch, coupons.length]);


    useEffect(() => {
        const timer = setInterval(() => {
            dispatch(fetchCoupons());
        }, 20000);
        return () => clearInterval(timer);
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(setError(''));
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    const handleClaim = async (couponId) => {
        try {
            await dispatch(claimCoupon({ couponId, sessionId })).unwrap();
            dispatch(fetchCoupons());
        } catch (error) {
            console.error("Error claiming coupon:", error);
        }
    };

    return (
        <div className="min-h-screen bg-black mt-20 flex flex-col items-center justify-center p-8 text-white">
            <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
                Available Coupons
            </h1>

            {message && (
                <div className="text-yellow-400 text-xl font-semibold bg-black bg-opacity-40 px-6 py-3 rounded-lg shadow-md mb-6 animate-fadeIn">
                    {message}
                </div>
            )}

            {/* Loading state */}
            {loading && (
                <div className="flex items-center justify-center my-6">
                    <div className="w-12 h-12 border-t-4 border-b-4 border-yellow-500 rounded-full animate-spin"></div>
                </div>
            )}

            {/* Error state */}
            {error && (
                <div className="text-red-500 text-xl font-semibold bg-black bg-opacity-40 px-6 py-3 rounded-lg shadow-md mb-6">
                    {error?.message || "Something went wrong!"}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {coupons.length > 0 ? (
                    coupons.map((coupon) => (
                        <div
                            key={coupon._id}
                            className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 p-6 rounded-2xl shadow-xl border border-yellow-800 
                            transform transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/50 flex flex-col items-center w-[340px] h-[180px] justify-between"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-8 bg-yellow-500 rounded-b-full border border-yellow-800"></div>

                            <div className="w-full text-center text-black text-xl font-bold border-b-2 border-dashed border-yellow-800 pb-2 tracking-widest">
                                {coupon.code}
                            </div>

                            <p className="text-black text-center text-lg italic px-4">
                                {coupon.description}
                            </p>

                            <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full border-2 border-yellow-800"></div>
                            <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-900 rounded-full border-2 border-yellow-800"></div>

                            <button
                                onClick={() => handleClaim(coupon._id)}
                                disabled={coupon.claimedBy?.some(claim => claim.user === sessionId)}
                                className={`mt-2 px-6 py-2 text-lg font-semibold rounded-xl shadow-md transition-transform 
        ${coupon.claimedBy?.some(claim => claim.user === sessionId)
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-yellow-800 to-yellow-900 text-white hover:scale-110 hover:shadow-yellow-800/50"
                                    }`}
                            >
                                {coupon.claimedBy?.some(claim => claim.user === sessionId) ? "Claimed" : "Claim"}
                            </button>

                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-8 bg-yellow-500 rounded-t-full border border-yellow-800"></div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-lg">No coupons available yet. Check back soon!</p>
                )}
            </div>
        </div>
    );
};

export default Coupons;