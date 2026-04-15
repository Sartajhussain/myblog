import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { setLoading, setUser } from "../redux/authSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";
import loginImg from "../assets/login-img.png";
import { API_BASE_URL } from "../utils/api";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const { email, password } = input;

  // 🔥 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success(`Welcome back, ${response.data.user.firstName}!`);
        dispatch(setUser(response.data.user));
        navigate("/");
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 🔥 SEND OTP
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      dispatch(setLoading(true));

     

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/forgot-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

   

      if (res.data.success) {
        toast.success("Verification code sent!");
        setVerificationMode(true);
      }

    } catch (error) {
      console.log("ERROR:", error.response?.data); // 🔥 SEE THIS

      toast.error(
        error.response?.data?.message || "Failed to send link"
      );
    } finally {
      dispatch(setLoading(false));
    }
  };

  // 🔥 OTP CHANGE
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  // 🔥 VERIFY OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    const finalOtp = otp.join("");

    if (finalOtp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      dispatch(setLoading(true));

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/verify-otp`,
        { email, otp: finalOtp }
      );

      if (res.data.success) {
        toast.success("OTP verified!");
        setForgotMode(false);
        setVerificationMode(false);
        setOtp(["", "", "", "", "", ""]);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 flex flex-col md:flex-row min-h-[100dvh]">

      {/* LEFT IMAGE */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gray-200 dark:bg-gray-800">
        <img
          src={loginImg}
          alt="Login Visual"
          className="w-[90%] h-[90%] object-cover"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-16 mt-4 md:mt-10 overflow-y-auto">

        <div className="w-full max-w-sm p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200">

          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
            {forgotMode
              ? (verificationMode ? "Verify Code" : "Reset Password")
              : "Welcome Back!"}
          </h2>

          {!forgotMode && (
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm mb-8">
              Log in to continue exploring the latest tech & web trends.
            </p>
          )}

          <form
            className="space-y-5"
            onSubmit={
              forgotMode
                ? (verificationMode ? handleVerifyOTP : handleForgotPassword)
                : handleLogin
            }
          >

            {/* EMAIL */}
            <div>
              <label className="block text-gray-800 dark:text-gray-200 font-medium mb-2 text-sm">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 outline-none text-sm
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                value={email}
                onChange={(e) => setInput({ ...input, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>

            {/* PASSWORD */}
            {!forgotMode && (
              <div className="relative">
                <label className="block text-gray-800 dark:text-gray-200 font-medium mb-2 text-sm">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg 
                         focus:ring-2 focus:ring-blue-500 outline-none text-sm
                         bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  value={password}
                  onChange={(e) => setInput({ ...input, password: e.target.value })}
                  required
                />
                <div
                  className="absolute right-3 top-9 text-gray-500 dark:text-gray-300 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </div>
              </div>
            )}

            {/* OTP */}
            {verificationMode && (
              <div>
                <label className="block text-gray-800 dark:text-gray-200 font-medium mb-2 text-sm">
                  Verification Code
                </label>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      className="w-full h-10 text-center border border-gray-300 dark:border-gray-700 rounded-lg 
                             focus:ring-2 focus:ring-blue-500 outline-none text-sm
                             bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* BUTTON */}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg 
                     bg-black hover:bg-gray-800 dark:bg-black dark:hover:bg-gray-600 
                     text-white transition-all duration-300 font-semibold text-sm"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : forgotMode ? (
                verificationMode ? "Verify Code" : "Send Reset Link"
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* FORGOT PASSWORD */}
          {!forgotMode && (
            <p
              className="mt-2 text-right text-[12px] text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
              onClick={() => setForgotMode(true)}
            >
              Forgot Password?
            </p>
          )}

          {/* FOOTER */}
          {!forgotMode && (
            <p className="mt-6 text-gray-700 dark:text-gray-300 text-center text-sm">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          )}

          {forgotMode && !verificationMode && (
            <p
              className="mt-6 text-gray-700 dark:text-gray-300 text-center text-sm cursor-pointer hover:underline"
              onClick={() => setForgotMode(false)}
            >
              Back to Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;