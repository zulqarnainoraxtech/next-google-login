const express = require("express");
const passport = require("passport");
const {
  googleCallback,
  getMe,
  logout,
} = require("../controllers/authController");
const { protect } = require("../middleware/protect");

const router = express.Router();

// Step 1: Redirect user to Google for authentication
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

// Step 2: Google redirects back here after user approves
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_failed`,
  }),
  googleCallback,
);

// GET /api/auth/me — protected, returns logged-in user data
router.get("/me", protect, getMe);

// POST /api/auth/logout — clears JWT cookie
router.post("/logout", logout);

module.exports = router;
