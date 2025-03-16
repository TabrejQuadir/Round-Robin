import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCoupons, triggerRefetch, addCoupon, toggleCoupon, deleteCoupon } from "../redux/coupunSlice";
import { Plus, ToggleLeft, ToggleRight, Trash, CheckCircle, XCircle } from "lucide-react";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { coupons, loading, error } = useSelector((state) => state.coupon);
    const [newCoupon, setNewCoupon] = useState({ code: "", description: "" });
    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    // Fetch Coupons when Component Mounts
    useEffect(() => {
        dispatch(fetchCoupons());
    }, [dispatch]);

    const handleAddCoupon = async () => {
        if (!newCoupon.code || !newCoupon.description) {
            setFormError("Please fill in both fields");
            return;
        }
        setFormError("");

        try {
            await dispatch(addCoupon(newCoupon)).unwrap(); // Ensure successful API response
            setSuccessMessage("Coupon added successfully!");
            setNewCoupon({ code: "", description: "" });
            dispatch(triggerRefetch());
            dispatch(fetchCoupons());
            console.log("triggerRefetch dispatched");
        } catch (error) {
            setFormError("Failed to add coupon. Please try again.");
        }

        setTimeout(() => setSuccessMessage(""), 3000);
    };


    // Handle Toggle Coupon (Active/Inactive)
    const handleToggle = async (id) => {
        try {
            await dispatch(toggleCoupon(id)).unwrap(); // Ensure success
            dispatch(fetchCoupons()); // ✅ Fetch latest coupons
        } catch (error) {
            setFormError("Failed to toggle coupon status.");
        }
    };

    // Handle Delete Coupon
    const handleDelete = async (id) => {
        try {
            await dispatch(deleteCoupon(id)).unwrap(); // Ensure success
            dispatch(fetchCoupons()); // ✅ Fetch latest coupons
        } catch (error) {
            setFormError("Failed to delete coupon.");
        }
    };

    // Handle Delete Confirmation
    const handleDeleteConfirm = (id) => {
        setDeletingId(id);
    };

    // Handle Delete Cancel
    const handleDeleteCancel = () => {
        setDeletingId(null);
    };


    return (
        <div className=" bg-black mt-20 text-white flex flex-col items-center p-8">
            {/* Premium Gold Heading */}
            <h1 className="text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-lg">
                Admin Dashboard
            </h1>

            <Link
                to="/claimed"
                className="absolute top-28 right-6 bg-black/40 px-6 py-2 rounded-xl border border-yellow-500 text-yellow-300 font-semibold 
             shadow-md backdrop-blur-md transition-all duration-300 hover:bg-yellow-500 hover:text-black  flex items-center gap-2"
            >
                <span className="relative">
                    Claimed Coupons
                    <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-yellow-400 transform scale-x-0 transition-transform duration-300 hover:scale-x-100"></span>
                </span>
            </Link>


            {/* Success Message */}
            {successMessage && (
                <div className="text-green-400 text-xl font-semibold bg-black bg-opacity-40 px-6 py-3 rounded-lg shadow-md mb-6 animate-fadeIn">
                    {successMessage}
                </div>
            )}

            {/* Add Coupon Form (Single Row & Stylish) */}
            <div className="relative w-full max-w-4xl mb-8 flex items-center bg-black bg-opacity-40 p-4 rounded-xl shadow-lg backdrop-blur-md border border-yellow-500 transition-all duration-300 hover:shadow-yellow-500/40">
                {/* Coupon Code Input */}
                <input
                    type="text"
                    placeholder="Coupon Code"
                    value={newCoupon.code}
                    onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                    className={`flex-1 px-5 py-3 rounded-lg bg-black bg-opacity-50 text-yellow-300 border border-yellow-500 focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-yellow-500 text-lg tracking-wide outline-none ${formError && !newCoupon.code ? "border-red-500" : ""
                        }`}
                />
                {formError && !newCoupon.code && (
                    <p className="text-red-500 text-sm mt-1">Coupon code is required</p>
                )}

                {/* Description Input */}
                <input
                    type="text"
                    placeholder="Description"
                    value={newCoupon.description}
                    onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                    className={`flex-1 px-5 py-3 ml-4 rounded-lg bg-black bg-opacity-50 text-yellow-300 border border-yellow-500 focus:ring-2 focus:ring-yellow-400 transition-all duration-300 placeholder-yellow-500 text-lg tracking-wide outline-none ${formError && !newCoupon.description ? "border-red-500" : ""
                        }`}
                />
                {formError && !newCoupon.description && (
                    <p className="text-red-500 text-sm mt-1">Description is required</p>
                )}

                {/* Add Button */}
                <button
                    onClick={handleAddCoupon}
                    disabled={loading}
                    className={`ml-4 flex items-center justify-center gap-3 px-6 py-3 rounded-lg text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-700 text-black shadow-lg transition-all transform ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:shadow-yellow-500/50 active:scale-95"
                        } cursor-pointer`}
                >
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Plus size={22} />}
                    Add
                </button>
            </div>

            {/* Loading & Error Messages */}
            {loading && (
                <div className="flex items-center justify-center my-6">
                    <div className="w-12 h-12 border-t-4 border-b-4 border-yellow-500 rounded-full animate-spin"></div>
                </div>
            )}

            {error && <p className="text-red-500">{error?.message || "Something went wrong!"}</p>}

            {/* Coupon Management Table (Fixed Height with Scrollbar & Luxurious Design) */}
            <div className="w-full max-w-6xl bg-black bg-opacity-40 rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-y-auto max-h-96">
                    <table className="w-full border-collapse">
                        {/* Table Header */}
                        <thead className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black text-lg rounded-t-xl">
                            <tr>
                                <th className="px-6 py-3 text-left rounded-tl-2xl">Coupon Code</th>
                                <th className="px-6 py-3 text-left">Description</th>
                                <th className="px-6 py-3 text-center">Status</th>
                                <th className="px-6 py-3 text-center rounded-tr-2xl">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            {coupons.map((coupon, index) => (
                                <tr
                                    key={coupon._id}
                                    className={`border-b-2 border-dashed border-yellow-500 hover:bg-yellow-900/20 transition duration-300 ${index % 2 === 0 ? "bg-yellow-900/10" : "bg-yellow-900/20"
                                        } ${deletingId === coupon._id ? "bg-red-900/30" : ""
                                        }`}
                                >
                                    <td className="px-6 py-4 font-semibold text-yellow-400 max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis">
                                        {coupon.code}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{coupon.description}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`px-3 py-1 text-sm font-bold rounded-lg cursor-none ${coupon.active ? "bg-green-500 text-black" : "bg-red-500 text-white"
                                                }`}
                                        >
                                            {coupon.active ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex justify-center gap-3">
                                        {/* Toggle Active/Inactive Button */}
                                        <button
                                            onClick={() => handleToggle(coupon._id)}
                                            className={`p-2 rounded-lg transition-transform hover:scale-110 cursor-pointer ${coupon.active ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
                                                }`}
                                        >
                                            {coupon.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                        </button>

                                        {/* Delete Button with Confirmation */}
                                        {deletingId === coupon._id ? (
                                            <>
                                                <button
                                                    onClick={() => handleDelete(coupon._id)}
                                                    className="bg-red-600 p-2 rounded-lg hover:bg-red-700 transition-transform hover:scale-110 cursor-pointer"
                                                >
                                                    <CheckCircle size={20} />
                                                </button>
                                                <button
                                                    onClick={handleDeleteCancel}
                                                    className="bg-gray-600 p-2 rounded-lg hover:bg-gray-700 transition-transform hover:scale-110 cursor-pointer"
                                                >
                                                    <XCircle size={20} />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleDeleteConfirm(coupon._id)}
                                                className="bg-red-600 hover:bg-red-700 p-2 rounded-lg transition-transform hover:scale-110 cursor-pointer"
                                            >
                                                <Trash size={20} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
