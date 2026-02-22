const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

router.get('/', async (req, res) => {
  try {
    const { rationCard } = req.query;

    if (!rationCard) {
      return res.status(400).json({
        message: "Ration card is required"
      });
    }

    // Get first day of current month
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const existing = await Transaction.findOne({
      rationCard,
      timestamp: { $gte: monthStart }
    });

    if (existing) {
      return res.status(200).json({
        distributed: true,
        message: "Ration already distributed this month"
      });
    }

    return res.status(200).json({
      distributed: false,
      message: "Ration not yet distributed this month"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;
