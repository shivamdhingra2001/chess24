const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => done(null, user));
});

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/users/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = await User.create({
        username: profile.displayName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// GitHub OAuth Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/v1/users/auth/github/callback`,
  scope: ["user:email"] // Request user email explicitly
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Try to get email from profile.emails
    let email = null;
    if (profile.emails && profile.emails.length > 0) {
      email = profile.emails[0].value;
    }
    // If not present, fetch emails from GitHub API
    if (!email) {
      const fetch = require('node-fetch');
      const response = await fetch('https://api.github.com/user/emails', {
        headers: {
          'Authorization': `token ${accessToken}`,
          'User-Agent': 'Node.js'
        }
      });
      const emails = await response.json();
      if (Array.isArray(emails)) {
        const primary = emails.find(e => e.primary && e.verified);
        email = (primary && primary.email) || (emails[0] && emails[0].email);
      }
    }
    if (!email) return done(new Error('No email from GitHub'), null);
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: profile.username,
        email,
        profilePicture: profile.photos[0].value
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));
