import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });
    const [localError, setLocalError] = useState("");

    // ✅ Automatically hide error after 3 seconds
    useEffect(() => {
        if (error) {
            setLocalError(error);
            const timer = setTimeout(() => setLocalError(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(registerUser(formData));
        if (registerUser.fulfilled.match(result)) navigate("/login"); // Redirect on success
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <div className="bg-black p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-yellow-400 mb-6 text-center">Register</h2>

                {/* ✅ Error message (disappears after 3 sec) */}
                {localError && (
                    <div className="text-red-500 text-center mb-4 bg-red-900 p-3 rounded-lg">
                        {localError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        name="name" type="text" placeholder="Name" 
                        value={formData.name} onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-yellow-500 focus:ring-2 focus:ring-yellow-400"
                    />
                    <input 
                        name="email" type="email" placeholder="Email" 
                        value={formData.email} onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-yellow-500 focus:ring-2 focus:ring-yellow-400"
                    />
                    <input 
                        name="password" type="password" placeholder="Password" 
                        value={formData.password} onChange={handleChange} 
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-yellow-500 focus:ring-2 focus:ring-yellow-400"
                    />

                    <button 
                        type="submit" 
                        className="w-full bg-yellow-500 p-3 rounded-lg font-bold text-black hover:bg-yellow-600 transition cursor-pointer "
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>

                {/* ✅ "Already have an account?" Link */}
                <p className="text-gray-400 text-center mt-4">
                    Already have an account?  
                    <Link to="/login" className="text-yellow-400 font-bold hover:text-yellow-500 transition ml-1">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
