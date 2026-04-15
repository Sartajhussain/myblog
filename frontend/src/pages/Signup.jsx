import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import signupImg from "../assets/form.jpg"; 
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../redux/authSlice.js";
import { Loader2 } from "lucide-react";
import loginImg from "../assets/login-img.png";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch(); 

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState(""); 

  const { firstName, lastName, email, password } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // Password strength check
    if (name === "password") {
      if (value.length < 6) setPasswordStrength("Too short");
      else if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(value)) setPasswordStrength("Good");
      else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) setPasswordStrength("Excellent");
      else setPasswordStrength("Weak");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for strong password before sending request
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, number & special character."
      );
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        user,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Registration Successful! Please Login.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Too short": return "bg-red-500";
      case "Weak": return "bg-orange-500";
      case "Good": return "bg-yellow-500";
      case "Excellent": return "bg-green-500";
      default: return "bg-gray-300";
    }
  };

  return (
  <div className="bg-gray-100 sign_up dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex flex-col md:flex-row min-h-[100dvh]">

  {/* LEFT IMAGE */}
  <div className="hidden md:flex md:w-1/2 bg-gray-200 dark:bg-gray-800 items-center justify-center">
    <img
      src={loginImg}
      alt="Signup Visual"
      className="w-[90%] h-[90%] object-cover"
    />
  </div>

  {/* RIGHT FORM */}
  <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-16 mt-4 md:mt-10 overflow-y-auto">

    <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">

      <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
        Create an Account
      </h2>

      <form className="space-y-5" onSubmit={handleSubmit}>

        {/* NAME ROW */}
        <div className="flex gap-3">
          <div className="w-1/2">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
              First Name
            </label>
            <input
              type="text"
              placeholder="First name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={firstName}
              name="firstName"
              onChange={handleChange}
            />
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Last name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={lastName}
              name="lastName"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* EMAIL */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            autoComplete="new-password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            name="email"
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm">
            Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg pr-10 focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            name="password"
            onChange={handleChange}
          />

          <div
            className="absolute right-3 top-9 text-gray-500 dark:text-gray-300 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </div>
        </div>

        {/* PASSWORD STRENGTH */}
        {password && (
          <div className="w-full h-1 rounded-full bg-gray-300 mt-2">
            <div
              className={`${getStrengthColor()} h-1 rounded-full transition-all duration-300`}
              style={{
                width:
                  passwordStrength === "Too short" ? "25%" :
                  passwordStrength === "Weak" ? "50%" :
                  passwordStrength === "Good" ? "75%" :
                  passwordStrength === "Excellent" ? "100%" : "0%",
              }}
            ></div>
          </div>
        )}

        {password && (
          <p className="text-[12px] mt-1 text-gray-700 dark:text-gray-300 font-medium">
            Strength: {passwordStrength}
          </p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-600 text-white py-2.5 rounded-lg transition font-semibold"
        >
          Sign Up
        </button>

      </form>

      {/* FOOTER */}
      <p className="mt-6 text-gray-600 dark:text-gray-300 text-center text-sm">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Please wait...
            </>
          ) : (
            "Login"
          )}
        </Link>
      </p>

    </div>
  </div>
</div>
  );
};

export default Signup;