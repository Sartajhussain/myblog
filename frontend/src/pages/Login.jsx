import React, { useState, useEffect } from "react";
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

  // 0 = login, 1 = forgot email, 2 = OTP, 3 = reset password
  const [step, setStep] = useState(0);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [input, setInput] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "", otp: "", newPassword: "" });
  const [touched, setTouched] = useState({});

  const { email, password } = input;

  // auto-verify OTP
  const otpRef = React.useRef([]);
  const verifyingRef = React.useRef(false);

  // ============ VALIDATION ============
  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
      if (!value.trim()) error = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        error = "Enter valid email";
    }
    if (name === "password") {
      if (!value) error = "Password is required";
      else if (value.length < 6) error = "Min 6 characters";
    }
    if (name === "newPassword") {
      if (!value) error = "Password is required";
      else if (value.length < 6) error = "Min 6 characters";
    }
    return error;
  };

  const handleInputChange = (name, value) => {
    setInput({ ...input, [name]: value });
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleInputBlur = (name, value) => {
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  // ============ LOGIN ============
  const handleLogin = async (e) => {
    e.preventDefault();

    const emailErr = validateField("email", email);
    const passErr = validateField("password", password);
    setErrors({ ...errors, email: emailErr, password: passErr });
    setTouched({ email: true, password: true });

    if (emailErr || passErr) return;

    try {
      dispatch(setLoading(true));
      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/user/login`,
        { email, password },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(setUser(data.user));
        toast.success(`Welcome back, ${data.user.firstName}!`);
        navigate("/");
      }
    } catch (error) {
      const data = error.response?.data;

      // ✅ Verification needed → OTP page pe bhejo
      if (data?.needsVerification) {
        toast.error("Please verify your email first");
        navigate("/verify-email", { state: { email: data.email } });
        return;
      }

      toast.error(data?.message || "Login failed");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ============ SEND OTP ============
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    const emailErr = validateField("email", email);
    setErrors({ ...errors, email: emailErr });
    setTouched({ ...touched, email: true });

    if (emailErr) return;

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/forgot-password`,
        { email },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (res.data.success) {
        toast.success("OTP sent!");
        setStep(2);
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
      if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("user")) {
        setErrors({ ...errors, email: msg });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ============ OTP CHANGE ============
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setErrors({ ...errors, otp: "" });

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  // ============ AUTO VERIFY OTP ============
  useEffect(() => {
    const finalOtp = otp.join("");
    if (step === 2 && finalOtp.length === 6 && !verifyingRef.current) {
      handleVerifyOTP(finalOtp);
    }
  }, [otp, step]);

  const handleVerifyOTP = async (finalOtp) => {
    if (verifyingRef.current) return;
    verifyingRef.current = true;
    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/verify-otp`,
        { email, otp: finalOtp }
      );

      if (res.data.success) {
        toast.success("OTP verified!");
        setResetToken(res.data.resetToken);
        setStep(3);
        setNewPassword("");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid OTP";
      setErrors({ ...errors, otp: msg });
      toast.error(msg);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => document.getElementById("otp-0")?.focus(), 100);
    } finally {
      dispatch(setLoading(false));
      verifyingRef.current = false;
    }
  };

  // ============ RESET PASSWORD ============
  const handleResetPassword = async (e) => {
    e.preventDefault();

    const passErr = validateField("newPassword", newPassword);
    setErrors({ ...errors, newPassword: passErr });
    setTouched({ ...touched, newPassword: true });

    if (passErr) return;

    try {
      dispatch(setLoading(true));
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/reset-password`,
        { resetToken, newPassword }
      );

      if (res.data.success) {
        toast.success("Password reset! Please login.");
        setStep(0);
        setOtp(["", "", "", "", "", ""]);
        setNewPassword("");
        setResetToken("");
        setInput({ email, password: "" });
        setErrors({ email: "", password: "", otp: "", newPassword: "" });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Reset failed";
      toast.error(msg);
      if (msg.toLowerCase().includes("password")) {
        setErrors({ ...errors, newPassword: msg });
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const heading =
    step === 0
      ? "Welcome Back!"
      : step === 1
      ? "Forgot Password"
      : step === 2
      ? "Verify OTP"
      : "Set New Password";

  // ============ INPUT CLASSES ============
  const inputClass = (field) =>
    `w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 outline-none text-sm transition-colors ${
      errors[field] && touched[field]
        ? "border-red-500 focus:ring-2 focus:ring-red-500"
        : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
    }`;

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
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6 md:p-16 overflow-y-auto">
        <div className="w-full max-w-sm p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800">
          <h2 className="text-3xl font-bold text-center mb-2">{heading}</h2>

          {step === 0 && (
            <p className="text-gray-600 dark:text-gray-400 text-center text-sm mb-6">
              Log in to continue exploring.
            </p>
          )}

          <form
            className="space-y-3"
            onSubmit={
              step === 0
                ? handleLogin
                : step === 1
                ? handleForgotPassword
                : step === 2
                ? (e) => e.preventDefault() // auto verify
                : handleResetPassword
            }
            noValidate
          >
            {/* EMAIL */}
            {(step === 0 || step === 1) && (
              <div>
                <label className="block text-xs font-medium mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={inputClass("email")}
                  value={email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  onBlur={(e) => handleInputBlur("email", e.target.value)}
                />
                <p className="text-[8px] leading-[10px] mt-0.5 min-h-[10px] text-red-500">
                  {touched.email && errors.email ? errors.email : ""}
                </p>
              </div>
            )}

            {/* PASSWORD (login) */}
            {step === 0 && (
              <div>
                <label className="block text-xs font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`${inputClass("password")} pr-10`}
                    value={password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    onBlur={(e) => handleInputBlur("password", e.target.value)}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </div>
                </div>
                <p className="text-[8px] leading-[10px] mt-0.5 min-h-[10px] text-red-500">
                  {touched.password && errors.password ? errors.password : ""}
                </p>
              </div>
            )}

            {/* OTP */}
            {step === 2 && (
              <div>
                <label className="block text-xs font-medium mb-2">
                  Verification Code (sent to {email})
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, index)}
                      onKeyDown={(e) => handleOtpKeyDown(e, index)}
                      disabled={loading}
                      autoFocus={index === 0}
                      className={`w-full h-11 text-center border rounded-lg outline-none text-base font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors ${
                        errors.otp
                          ? "border-red-500 focus:ring-2 focus:ring-red-500"
                          : "border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                      } disabled:opacity-60`}
                    />
                  ))}
                </div>
                <p className="text-[8px] leading-[10px] mt-1 min-h-[10px] text-red-500 text-center">
                  {errors.otp || ""}
                </p>
                {loading && (
                  <div className="flex items-center justify-center gap-1.5 text-blue-600 dark:text-blue-400 text-[10px] mt-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Verifying...
                  </div>
                )}
              </div>
            )}

            {/* NEW PASSWORD */}
            {step === 3 && (
              <div>
                <label className="block text-xs font-medium mb-1.5">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    className={`${inputClass("newPassword")} pr-10`}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (touched.newPassword) {
                        setErrors({
                          ...errors,
                          newPassword: validateField("newPassword", e.target.value),
                        });
                      }
                    }}
                    onBlur={() => {
                      setTouched({ ...touched, newPassword: true });
                      setErrors({
                        ...errors,
                        newPassword: validateField("newPassword", newPassword),
                      });
                    }}
                  />
                  <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </div>
                </div>
                <p className="text-[8px] leading-[10px] mt-0.5 min-h-[10px] text-red-500">
                  {touched.newPassword && errors.newPassword ? errors.newPassword : ""}
                </p>
              </div>
            )}

            {/* BUTTON — dark/light mode */}
            {step !== 2 && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : step === 0 ? (
                  "Login"
                ) : step === 1 ? (
                  "Send OTP"
                ) : (
                  "Reset Password"
                )}
              </button>
            )}
          </form>

          {/* FORGOT PASSWORD */}
          {step === 0 && (
            <p
              className="mt-2 text-right text-[11px] text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
              onClick={() => setStep(1)}
            >
              Forgot Password?
            </p>
          )}

          {/* FOOTER */}
          {step === 0 && (
            <p className="mt-6 text-center text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Sign up
              </Link>
            </p>
          )}

          {step !== 0 && (
            <p
              className="mt-6 text-center text-xs cursor-pointer hover:underline text-gray-600 dark:text-gray-400"
              onClick={() => {
                setStep(0);
                setOtp(["", "", "", "", "", ""]);
                setNewPassword("");
                setResetToken("");
                setErrors({ email: "", password: "", otp: "", newPassword: "" });
                setTouched({});
              }}
            >
              ← Back to Login
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;