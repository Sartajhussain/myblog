import React from "react";

import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

import { Link } from "react-router-dom";

import favIcons from "../assets/favIcons.png";
import Newsletter from "./Newsletter";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-gray-100 dark:bg-slate-900 text-gray-600 dark:text-gray-400 text-sm pt-16 pb-8 border-t border-gray-200 dark:border-slate-700 transition-colors duration-300">
      
      {/* Background Glow */}
      <div className="pointer-events-none absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.08] dark:opacity-[0.07] rounded-full blur-3xl animate-blob" />

      <div className="pointer-events-none absolute top-[-80px] right-[-80px] w-[350px] h-[350px] bg-[oklch(0.8_0.15_60)] opacity-[0.08] dark:opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-2000" />

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

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo + About */}
        <div>
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
              className="p-2 rounded-full bg-white dark:bg-slate-800 shadow hover:bg-black hover:text-white dark:hover:bg-black dark:hover:text-black transition"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Blog Categories */}
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
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-black dark:hover:text-white transition"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <Newsletter />
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