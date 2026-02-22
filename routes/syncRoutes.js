const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {

    const transactions = req.body;

    if (!Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        message: "No transactions to sync"
      });
    }

    const results = [];

    for (let transaction of transactions) {

      // 1️⃣ Check if user exists
      const user = await User.findOne({
        rationCard: transaction.rationCard
      });

      if (!user) {
        results.push({
          rationCard: transaction.rationCard,
          status: "FAILED",
          reason: "Invalid ration card"
        });
        continue;
      }

      // 2️⃣ Monthly duplicate check (Model A)
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const existing = await Transaction.findOne({
        rationCard: transaction.rationCard,
        timestamp: { $gte: monthStart }
      });

      if (existing) {
        results.push({
          rationCard: transaction.rationCard,
          status: "FAILED",
          reason: "Ration already distributed this month"
        });
        continue;
      }

      // 3️⃣ Save transaction using SERVER time
      await Transaction.create({
        rationCard: transaction.rationCard,
        shopId: transaction.shopId,
        quantityGiven: transaction.quantityGiven,
        timestamp: new Date()
      });

      results.push({
        rationCard: transaction.rationCard,
        status: "SUCCESS"
      });
    }

    return res.status(200).json({
      message: "Sync completed",
      results
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;
