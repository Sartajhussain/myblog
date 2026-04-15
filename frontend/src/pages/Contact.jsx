import React, { useState } from "react";

const Contact = () => {

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 mt-7 bg-gray-50 dark:bg-slate-950 transition-colors">

      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 md:p-12">

        {/* Heading */}
        <div className="text-center mb-10">

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Contact Me
          </h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            If you have any query then feel free to contact me.
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* First + Last Name */}
          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <label className="block mb-2 text-sm font-medium">
                First Name
              </label>

              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                required
              />

            </div>

            <div>

              <label className="block mb-2 text-sm font-medium">
                Last Name
              </label>

              <input
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
                required
              />

            </div>

          </div>

          {/* Email */}
          <div>

            <label className="block mb-2 text-sm font-medium">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              required
            />

          </div>

          {/* Message */}
          <div>

            <label className="block mb-2 text-sm font-medium">
              Your Query
            </label>

            <textarea
              rows="5"
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              required
            />

          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-90 transition"
          >
            Send Message
          </button>

        </form>

      </div>

    </div>
  );
};

export default Contact;