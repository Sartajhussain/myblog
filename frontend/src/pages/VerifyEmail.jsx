import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_BASE_URL } from "../utils/api";
import { Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

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

  const handleVerify = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join("");

    if (!email) return toast.error("Email missing");
    if (finalOtp.length !== 6) return toast.error("Enter complete OTP");

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/verify-email`,
        { email, otp: finalOtp }
      );
      if (res.data.success) {
        toast.success("Email verified! Please login.");
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/user/resend-verification`,
        { email }
      );
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Resend failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleVerify}
        className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Verify Your Email
        </h2>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          OTP sent to <b>{email}</b>
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:text-white"
          required
        />

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
              className="w-full h-12 text-center border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Verify Email"}
        </button>

        <button
          type="button"
          onClick={handleResend}
          className="w-full text-blue-600 text-sm hover:underline"
        >
          Resend OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;