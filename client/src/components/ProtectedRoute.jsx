import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const user = useSelector((state) => state.auth.user);

  // ✅ If the user is an admin, allow access; otherwise, redirect to "/"
  return user && user.role === "admin" ? element : <Navigate to="/" replace />;
};

export default ProtectedRoute;
