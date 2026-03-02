const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper to issue JWT cookie
const signTokenAndSetCookie = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  return token;
};

// Called after Passport Google callback succeeds
const googleCallback = (req, res) => {
  try {
    signTokenAndSetCookie(res, req.user);
    // Redirect to the frontend dashboard
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    console.error("googleCallback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=auth_failed`);
  }
};

// GET /api/auth/me — returns current logged-in user
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-__v");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/auth/logout — clears cookie
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

module.exports = { googleCallback, getMe, logout };
