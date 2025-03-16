import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../redux/authSlice";
import { useEffect } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user); // Get user from Redux store

  // Handle Logout
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="w-6xl mx-auto flex justify-between items-center px-24 py-4  
              bg-white/10 backdrop-blur-lg border border-white/20 shadow-md 
              rounded-full text-white transition-all duration-300 hover:shadow-white/50 fixed top-4 left-1/2 -translate-x-1/2 z-50 ">

      {/* Left - Logo */}
      <div>
        <Link to="/" className="text-2xl font-bold tracking-wide hover:text-blue-400 transition cursor-pointer">
          Round Robin Coupons
        </Link>
      </div>

      {/* Right - Conditional Buttons */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            {user.role === "admin" ? (
              <Link to="/admin" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer">
                Manage Coupons
              </Link>
            ) : (
              <span className="text-lg font-medium">Welcome, {user.name}</span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition cursor-pointer">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;