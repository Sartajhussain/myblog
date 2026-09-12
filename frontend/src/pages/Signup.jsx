import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../redux/authSlice.js";
import { Loader2 } from "lucide-react";
import loginImg from "../assets/login-img.png";
import { API_BASE_URL } from "../utils/api";

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

  // ✅ field-wise errors (inline)
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [touched, setTouched] = useState({});

  const { firstName, lastName, email, password } = user;

  // ================= VALIDATION =================
  const validateField = (name, value) => {
    let error = "";

    if (name === "firstName") {
      if (!value.trim()) error = "First name is required";
      else if (value.trim().length < 2) error = "Min 2 characters";
    }

    if (name === "lastName") {
      if (!value.trim()) error = "Last name is required";
      else if (value.trim().length < 2) error = "Min 2 characters";
    }

    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Enter valid email";
    }

    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 8) error = "Min 8 characters";
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value))
        error = "Need uppercase, lowercase, number & special";
    }

    return error;
  };

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });

    // ✅ sirf tab validate karo jab field touched ho
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }

    // Password strength
    if (name === "password") {
      if (!value) setPasswordStrength("");
      else if (value.length < 8) setPasswordStrength("Too short");
      else if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value)
      )
        setPasswordStrength("Excellent");
      else if (/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(value))
        setPasswordStrength("Good");
      else setPasswordStrength("Weak");
    }
  };

  // ✅ onBlur pe touched mark karo + validate
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sab fields validate karo
    const newErrors = {
      firstName: validateField("firstName", firstName),
      lastName: validateField("lastName", lastName),
      email: validateField("email", email),
      password: validateField("password", password),
    };
    setErrors(newErrors);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
    });

    if (Object.values(newErrors).some((err) => err)) {
      toast.error("Please fix the errors");
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/register`,
        user,
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (response.data.success) {
        toast.success("OTP sent! Please check your email.");
        navigate("/verify-email", { state: { email: user.email } });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      toast.error(msg);

      // ✅ Backend error ko bhi field me dikhao
      if (msg.toLowerCase().includes("email")) {
        setErrors({ ...errors, email: msg });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ================= STRENGTH =================
  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Too short":
        return "bg-red-500";
      case "Weak":
        return "bg-orange-500";
      case "Good":
        return "bg-yellow-500";
      case "Excellent":
        return "bg-green-500";
      default:
        return "bg-transparent";
    }
  };

  const getStrengthWidth = () => {
    switch (passwordStrength) {
      case "Too short":
        return "25%";
      case "Weak":
        return "50%";
      case "Good":
        return "75%";
      case "Excellent":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 pt-[100px] md:pt-7 flex flex-col md:flex-row min-h-[100dvh]">
      {/* LEFT IMAGE */}
      <div className="hidden md:flex md:w-1/2 bg-gray-200  dark:bg-gray-800 items-center justify-center">
        <img
          src={loginImg}
          alt="Signup Visual"
          className="w-[90%] h-[90%] object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-16 overflow-y-auto">
        <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Create an Account
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            {/* NAME ROW */}
            <div className="flex gap-3">
              {/* FIRST NAME */}
              <div className="w-1/2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-xs">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none text-sm transition-colors ${
                    errors.firstName && touched.firstName
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  }`}
                  value={firstName}
                  name="firstName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {/* ✅ reserved space for error — no layout shift */}
                <p className="text-[8px] leading-[10px] mt-0.5 min-h-[10px] text-red-500">
                  {touched.firstName && errors.firstName ? errors.firstName : ""}
                </p>
              </div>

              {/* LAST NAME */}
              <div className="w-1/2">
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-xs">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none text-sm transition-colors ${
                    errors.lastName && touched.lastName
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  }`}
                  value={lastName}
                  name="lastName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <p className="text-[8px] leading-[10px] mt-0.5 min-h-[10px] text-red-500">
                  {touched.lastName && errors.lastName ? errors.lastName : ""}
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-xs">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="new-password"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none text-sm transition-colors ${
                  errors.email && touched.email
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                }`}
                value={email}
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <p className="text-[8px] leading-[10px] mt-0.5 min-h-[10px] text-red-500">
                {touched.email && errors.email ? errors.email : ""}
              </p>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1.5 text-xs">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`w-full px-3 py-2 pr-10 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none text-sm transition-colors ${
                    errors.password && touched.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500"
                      : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                  }`}
                  value={password}
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </div>
              </div>

              {/* ✅ STRENGTH BAR — thin (h-0.5), fixed height, no jump */}
              <div className="mt-1 h-0.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor()} transition-all duration-300 rounded-full`}
                  style={{ width: getStrengthWidth() }}
                ></div>
              </div>

              {/* Error + Strength text (8px) */}
              <div className="flex justify-between items-center mt-0.5 min-h-[10px]">
                <p className="text-[8px] leading-[10px] text-red-500">
                  {touched.password && errors.password ? errors.password : ""}
                </p>
                <p className="text-[8px] leading-[10px] text-gray-500 dark:text-gray-400">
                  {password && passwordStrength ? passwordStrength : ""}
                </p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 py-2.5 rounded-lg transition font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="mt-6 text-gray-600 dark:text-gray-300 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;