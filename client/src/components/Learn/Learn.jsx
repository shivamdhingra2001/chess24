import React, { useEffect, useState } from "react";
import MiniDrawer from "../Home/Minidrawer";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// ✅ Load Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Learn = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [purchasedCourses, setPurchasedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [allRes, purchasedRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/courses/all`),
          axios.get(`${process.env.REACT_APP_SERVER_URL}/api/courses/purchased`, {
            withCredentials: true,
          }),
        ]);

        setAllCourses(allRes.data);
        setPurchasedCourses(purchasedRes.data);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
      }
    };

    fetchCourses();
  }, []);

  const handleBuy = async (course) => {
    const stripe = await stripePromise;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/payment/create-checkout-session`,
        { course },
        { withCredentials: true }
      );

      if (res.data.id) {
        const result = await stripe.redirectToCheckout({
          sessionId: res.data.id,
        });
        if (result.error) alert(result.error.message);
      } else {
        alert("Failed to create Stripe session.");
      }
    } catch (error) {
      console.error("Stripe error:", error);
      alert("An error occurred during checkout.");
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-blue-900 min-h-screen flex flex-row overflow-hidden">
      {/* Floating background shapes */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-700 opacity-30 rounded-full blur-3xl z-0 animate-pulse" />
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-blue-400 opacity-20 rounded-full blur-2xl z-0 animate-pulse" />
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-white opacity-10 rounded-full blur-2xl z-0 animate-pulse" />
      <MiniDrawer />
      <div className="p-2 sm:p-4 md:p-6 w-full z-10">
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-blue-100 drop-shadow text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 60 }}
        >
          Purchase Courses
        </motion.h1>
        <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-blue-400 to-blue-700 rounded-full mb-4 sm:mb-6 animate-pulse mx-auto" />
        <motion.h2
          className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-blue-100 drop-shadow text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
        >
          Learn from the Masters
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.12 }
            }
          }}
        >
          {allCourses.map((course, idx) => {
            const isPurchased = purchasedCourses.includes(course.title);
            return (
              <motion.div
                key={course._id}
                className="bg-gradient-to-br from-[#232b3b] to-[#1e293b] rounded-2xl shadow-xl border border-gray-700 hover:border-blue-500 transition-all duration-200 flex flex-col overflow-hidden min-w-0"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { delay: idx * 0.08, duration: 0.5 } }
                }}
                whileHover={{ scale: 1.04, boxShadow: "0 8px 32px 0 rgba(0, 123, 255, 0.18)" }}
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-40 sm:h-48 object-cover rounded-t-2xl mb-2 sm:mb-4 border-b border-gray-700"
                />
                <div className="flex flex-col flex-1 px-3 sm:px-4 pb-3 sm:pb-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-blue-200 mb-1">
                    {course.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-blue-300 mb-1 sm:mb-2">
                    {course.instructor || "Anonymous"}
                  </p>
                  <p className="text-blue-100 mb-1 sm:mb-2 flex-1 text-xs sm:text-base">
                    {course.description}
                  </p>
                  <p className="font-bold text-green-400 mb-1 sm:mb-2 text-sm sm:text-base">
                    ₹{course.price}
                  </p>
                  {isPurchased ? (
                    <motion.button
                      onClick={() => navigate(`/course/${course.title}`)}
                      className="mt-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition font-semibold shadow text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      View Course
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => handleBuy(course)}
                      className="mt-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold shadow text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Buy Now
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Learn;
