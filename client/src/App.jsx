import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import Coupons from "./pages/Coupons";
import Navbar from "./components/Navbar";
import ClaimedCoupun from "./pages/ClaimedCoupun";
import ProtectedRoute from "./components/ProtectedRoute"; 

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Coupons />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ Protect Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} />} />
        <Route path="/claimed" element={<ProtectedRoute element={<ClaimedCoupun />} />} />
      </Routes>
    </Router>
  );
}

export default App;
