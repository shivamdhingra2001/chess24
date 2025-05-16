import MiniDrawer from "../Home/Minidrawer";
import { useState } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";

function Feedback() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    const templateParams = {
      user_name: form.name,
      user_email: form.email,
      subject: "Feedback", // Default subject for template
      message: form.message,
    };

    emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
        templateParams,
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          console.log("Feedback sent successfully!");
          setSubmitted(true);
          setForm({ name: "", email: "", message: "" });
          setLoading(false); // Reset loading after success
        },
        (error) => {
          console.error("EmailJS error:", error);
          setLoading(false); // Reset loading if there's an error
        }
      );
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen w-full flex flex-row text-white overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      <MiniDrawer />
      <div className="flex flex-col w-full px-2 sm:px-6 md:px-20 py-8 sm:py-12 md:py-20 gap-6 mt-8 lg:mt-0 sm:gap-4 z-10">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-blue-100 drop-shadow mb-2"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring", stiffness: 60 }}
        >
          Feedback
        </motion.h1>
        <div className="h-1 w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mb-2 animate-pulse" />
        <motion.p
          className="text-gray-300 text-lg max-w-2xl text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          We’d love to hear your thoughts! Whether it’s a suggestion, bug report,
          or general comment, your feedback helps improve Chess24 for everyone.
        </motion.p>
        <motion.form
          className="w-full max-w-2xl mt-4 flex flex-col gap-6 bg-[#232b3b]/90 rounded-2xl shadow-2xl p-6 sm:p-8 border border-gray-700 backdrop-blur-md"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
            type: "spring",
            stiffness: 60,
          }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="bg-gray-800 text-white rounded px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-700 transition-all duration-200 placeholder:text-gray-500"
              placeholder="Your name"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="bg-gray-800 text-white rounded px-4 py-2 border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-700 transition-all duration-200 placeholder:text-gray-500"
              placeholder="Your email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Message</label>
            <textarea
              name="message"
              required
              value={form.message}
              onChange={handleChange}
              className="bg-gray-800 text-white rounded px-4 py-2 h-32 resize-none border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-700 transition-all duration-200 placeholder:text-gray-500"
              placeholder="Write your message here..."
            ></textarea>
          </div>

          <motion.button
            type="submit"
            disabled={loading || submitted}
            className="bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold p-2 rounded shadow hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            whileHover={!loading && !submitted ? { scale: 1.04 } : {}}
            whileTap={!loading && !submitted ? { scale: 0.98 } : {}}
            animate={loading ? { opacity: 0.7 } : { opacity: 1 }}
          >
            {loading ? "Sending..." : submitted ? "Sent!" : "Send Feedback"}
          </motion.button>

          {submitted && (
            <motion.p
              className="text-green-400 text-sm mt-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Thank you for your feedback!
            </motion.p>
          )}
        </motion.form>
      </div>
    </div>
  );
}

export default Feedback;
