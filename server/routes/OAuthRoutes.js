const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Google OAuth
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: true }),
  (req, res) => {
    // Set JWT cookie for frontend
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, {
     httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

// GitHub OAuth
router.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: true }),
  (req, res) => {
    // Set JWT cookie for frontend
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.cookie('token', token, {
     httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.redirect(`${process.env.FRONTEND_URL}/home`);
  }
);

module.exports = router;
