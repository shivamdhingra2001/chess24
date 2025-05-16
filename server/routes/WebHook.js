const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");

const router = express.Router();

// This is required to verify the webhook signature
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const courseTitle = session.metadata.courseTitle;
      console.log("🎯 Stripe checkout.session.completed fired!");
      console.log("📦 Session data:", session);

      try {
        const user = await User.findById(userId);
        if (user && !user.purchasedCourses.includes(courseTitle)) {
          user.purchasedCourses.push(courseTitle);
          await user.save();
          console.log(`✅ Added course "${courseTitle}" to user ${user.email}`);
        }
      } catch (err) {
        console.error("❌ Error updating user:", err);
      }
    }

    res.status(200).json({ received: true });
  }
);

module.exports = router;
