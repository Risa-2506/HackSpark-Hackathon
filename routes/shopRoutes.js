const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users under a shop
router.get('/:shopId/users', async (req, res) => {
  try {
    const { shopId } = req.params;

    const users = await User.find(
      { shopId },
      'rationCard name allocationKg secretKey utid'
    );

    if (!users.length) {
      return res.status(404).json({
        message: "No users found for this shop"
      });
    }

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;
