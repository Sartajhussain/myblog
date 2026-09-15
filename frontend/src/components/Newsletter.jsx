import React, { useEffect, useState } from "react";

import {
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";

import { Loader2 } from "lucide-react";

import axios from "axios";

import { API_BASE_URL } from "../utils/api";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [subscriberCount, setSubscriberCount] = useState(0);

  // ==========================================
  // GET TOTAL SUBSCRIBER COUNT
  // ==========================================
  useEffect(() => {
    const fetchSubscriberCount = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/api/v1/newsletter/count`
        );

        if (data.success) {
          setSubscriberCount(data.totalSubscribers);
        }
      } catch (error) {
        console.error(
          "Failed to fetch subscriber count:",
          error
        );
      }
    };

    fetchSubscriberCount();
  }, []);

  // ==========================================
  // SUBSCRIBE NEWSLETTER
  // ==========================================
  const handleSubscribe = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/newsletter/subscribe`,
        {
          email: normalizedEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        setStatus("success");
        setMessage(
          data.message || "Subscribed successfully!"
        );

        setEmail("");

        // Immediately update count
        setSubscriberCount((prev) => prev + 1);

        // Clear success message
        setTimeout(() => {
          setStatus("idle");
          setMessage("");
        }, 4000);
      }
    } catch (error) {
      setStatus("error");

      setMessage(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );

      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 transition-colors duration-300">
      
      {/* Heading + Subscriber Count */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Subscribe
        </h3>

        <span className="text-xs px-2.5 py-1 rounded-full bg-[oklch(0.71_0.2_46.45)]/10 border border-[oklch(0.71_0.2_46.45)]/20  font-semibold text-[oklch(0.71_0.2_46.45)]">
          {subscriberCount.toLocaleString()} subscribers
        </span>
      </div>

      <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
        Get latest blog updates directly in your inbox.
      </p>

      <form
        onSubmit={handleSubscribe}
        className="flex flex-col gap-3"
        noValidate
      >
        {/* Email */}
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === "loading"}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60 transition"
          required
        />

        {/* Subscribe Button */}
        <button
          type="submit"
          disabled={status === "loading" || !email.trim()}
          className="bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 transition px-5 py-2 rounded-lg text-white dark:text-black font-medium disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Subscribing...
            </>
          ) : (
            "Subscribe"
          )}
        </button>

        {/* Success / Error Message */}
        {message && (
          <div
            className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg ${
              status === "success"
                ? "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800"
            }`}
          >
            {status === "success" ? (
              <FaCheckCircle className="mt-0.5 shrink-0" />
            ) : (
              <FaExclamationCircle className="mt-0.5 shrink-0" />
            )}

            <span>{message}</span>
          </div>
        )}
      </form>
    </div>
  );
};

export default Newsletter;