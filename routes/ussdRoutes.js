const express = require("express");
const speakeasy = require("speakeasy");
const router = express.Router();
const User = require("../models/User");

router.post("/get-utid", async (req, res) => {
  try {
    
    const { rationCard } = req.body;

    // 1️⃣ Validate input
    if (!rationCard) {
      return res.status(400).json({
        message: "Ration card is required"
      });
    }

    // 2️⃣ Find user using rationCard only
    const user = await User.findOne({ rationCard });

    if (!user) {
      return res.status(404).json({
        message: "Invalid ration card"
      });
    }

    // 3️⃣ Generate 15-minute TOTP
    const token = speakeasy.totp({
      secret: user.secretKey,
      encoding: "ascii",
      step: 900 // 900 seconds = 15 minutes
    });

    // 4️⃣ Send token + allocation to frontend
    return res.status(200).json({
      message: "Token generated successfully",
      token: token,
      allocationKg: user.allocationKg,
      validFor: "15 minutes"
    });

  } catch (error) {
    console.error("UTID generation error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;
