import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { API_BASE_URL } from "../utils/api";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/api/v1/contact`,
        form,
        { timeout: 10000 }
      );

      if (res.data.success) {
        toast.success("Message sent 🎉");
        setSuccessMsg("Form submitted successfully. I will contact you soon.");

        setForm({
          firstName: "",
          lastName: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      console.log("FULL ERROR:", error);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Network error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gray-50 dark:bg-slate-950">

      {/* =====================================================
          BACKGROUND GLOW — same theme as Login/Signup/Home/About/Footer
      ===================================================== */}

      {/* Orange glow — top-left */}
      <div className="pointer-events-none absolute top-[-100px] left-[-100px] w-[450px] h-[450px] bg-[oklch(0.71_0.2_46.45)] opacity-[0.1] dark:opacity-[0.08] rounded-full blur-3xl animate-blob" />

      {/* Orange lighter — bottom-right */}
      <div className="pointer-events-none absolute bottom-[-100px] right-[-100px] w-[450px] h-[450px] bg-[oklch(0.8_0.15_60)] opacity-[0.1] dark:opacity-[0.07] rounded-full blur-3xl animate-blob animation-delay-2000" />

      {/* Subtle gray — center */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gray-400 dark:bg-gray-600 opacity-[0.08] dark:opacity-[0.06] rounded-full blur-3xl animate-blob animation-delay-4000" />

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
          FORM CARD
      ===================================================== */}
      <div className="relative z-10 w-full max-w-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-slate-700">

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Feedback & Suggestions
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Share your suggestions or queries to help me improve.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              placeholder="First name"
              className="input"
              required
            />

            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              placeholder="Last name"
              className="input"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="input"
            required
          />

          <textarea
            rows="3"
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your message..."
            className="input resize-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Message"
            )}
          </button>

          {successMsg && (
            <p className="text-green-600 dark:text-green-400 text-sm text-center mt-2">
              {successMsg}
            </p>
          )}
        </form>
      </div>

      {/* =====================================================
          INPUT STYLES
      ===================================================== */}
      <style>{`
        .input {
          width: 100%;
          padding: 10px 10px;
          border-radius: 10px;
          background: white;
          border: 1px solid #e5e7eb;
          color: #111827;
          outline: none;
          font-size: 14px;
          transition: 0.2s;
        }

        .dark .input {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.15);
          color: white;
        }

        .input:focus {
          border-color: black;
          box-shadow: 0 0 0 2px rgba(0,0,0,0.08);
        }

        .dark .input:focus {
          border-color: white;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default Contact;