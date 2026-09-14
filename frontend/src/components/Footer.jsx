import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../utils/api";
import favIcons from "../assets/favIcons.png";   // ✅ ADDED

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    // basic client-side validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    try {
      setStatus("loading");
      setMessage("");

      const { data } = await axios.post(
        `${API_BASE_URL}/api/v1/newsletter/subscribe`,
        { email: email.trim().toLowerCase() },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (data.success) {
        setStatus("success");
        setMessage(data.message || "Subscribed successfully!");
        setEmail("");

        // reset back to idle after 4 sec
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
    <footer className="relative overflow-hidden bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 text-sm pt-16 pb-8 border-t border-gray-200 dark:border-slate-700 transition-colors duration-300">

      {/* =====================================================
          BACKGROUND GLOW — same theme as Login/Signup/Home
      ===================================================== */}

      {/* Orange glow — bottom-left */}
      <div className="pointer-events-none absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.08] dark:opacity-[0.07] rounded-full blur-3xl animate-blob" />

      {/* Orange lighter — top-right */}
      <div className="pointer-events-none absolute top-[-80px] right-[-80px] w-[350px] h-[350px] bg-[oklch(0.8_0.15_60)] opacity-[0.08] dark:opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-2000" />

      {/* Subtle gray blob — center */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-gray-400 dark:bg-gray-600 opacity-[0.06] dark:opacity-[0.05] rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Grid Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05] dark:opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
          {/* LOGO + TITLE */}
          <div className="flex items-center gap-2 mb-3">
            <img
              src={favIcons}
              alt="MyBlog Logo"
              className="w-7 h-7 object-contain"
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              MyBlog
            </h2>
          </div>

          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
            Sharing insights, tutorials, and ideas for developers and tech
            enthusiasts.
          </p>

          <div className="flex gap-3 mt-4">
            <a
              href="https://www.facebook.com/sartaj.hussain.144"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://github.com/Sartajhussain"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              <FaGithub />
            </a>
            <a
              href="https://www.instagram.com/sartaj_mansuri2002"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              <FaInstagram />
            </a>
            <a
              href="https://www.linkedin.com/in/sartaj-hussain/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Blog Links */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Blog Categories
          </h3>

          <ul className="space-y-2">
            <li>
              <Link
                to="/blogs"
                className="hover:text-black dark:hover:text-white transition"
              >
                All Blogs
              </Link>
            </li>

            <li>
              <Link
                to="/blogs"
                className="hover:text-black dark:hover:text-white transition"
              >
                JavaScript
              </Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2">
            <li>
              <Link
                to="/about"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-black dark:hover:text-white transition"
              >
                About
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="hover:text-black dark:hover:text-white transition"
                onClick={() => window.scrollTo(0, 0)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-md border border-gray-200 dark:border-slate-700 transition-colors duration-300">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            Subscribe
          </h3>

          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            Get latest blog updates directly in your inbox.
          </p>

          <form
            onSubmit={handleSubscribe}
            className="flex flex-col gap-3"
            noValidate
          >
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading"}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white disabled:opacity-60 transition"
              required
            />

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

            {/* SUCCESS / ERROR MESSAGE */}
            {message && (
              <div
                className={`flex items-start gap-2 text-xs px-3 py-2 rounded-lg ${status === "success"
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
      </div>

      {/* Bottom Footer */}
      <div className="relative z-10 mt-12 border-t border-gray-300 dark:border-slate-700 pt-6 text-center text-gray-500 dark:text-gray-400 text-xs">
        © {new Date().getFullYear()} MyBlog by Sartaj Hussain. All rights
        reserved.
      </div>
    </footer>
  );
};

export default Footer;