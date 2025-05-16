const express = require("express");
const router = express.Router();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require("../models/User");
const jwt = require("jsonwebtoken");



router.post("/create-checkout-session", async (req, res) => {
  const token = req.cookies.token; // JWT from cookie

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create Stripe session with user ID in metadata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: req.body.course.title,
              description: req.body.course.description,
            },
            unit_amount: req.body.course.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        userId: user._id.toString(),
        courseTitle: req.body.course.title,
      },
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});
module.exports = router;
