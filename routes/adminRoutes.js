const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Complaint = require('../models/Complaint');

router.get('/shop-stats', async (req, res) => {
  try {

    // 1️⃣ Transactions per shop
    const transactionStats = await Transaction.aggregate([
      {
        $group: {
          _id: "$shopId",
          totalTransactions: { $sum: 1 },
          totalDistributedKg: { $sum: "$quantityGiven" }
        }
      }
    ]);

    // 2️⃣ VALID complaints per shop only
    const complaintStats = await Complaint.aggregate([
      {
        $match: { differenceKg: { $gt: 0 } }   // ✅ ONLY VALID
      },
      {
        $group: {
          _id: "$shopId",
          validComplaints: { $sum: 1 },
          totalBlackKg: { $sum: "$differenceKg" }
        }
      }
    ]);

    const shopStats = transactionStats.map(shop => {

      const complaintData = complaintStats.find(
        c => c._id === shop._id
      );

      const validComplaints = complaintData ? complaintData.validComplaints : 0;
      const totalBlackKg = complaintData ? complaintData.totalBlackKg : 0;

      const complaintRatio =
        shop.totalTransactions > 0
          ? validComplaints / shop.totalTransactions
          : 0;

      // 🔴 NEW SHOP FRAUD LOGIC
      const isSuspicious =
        validComplaints > 5 ||          // many valid complaints
        complaintRatio > 0.3 ||         // high complaint ratio
        totalBlackKg > 20;              // high black kg

      return {
        shopId: shop._id,
        totalTransactions: shop.totalTransactions,
        totalDistributedKg: shop.totalDistributedKg,
        validComplaints,
        totalBlackKg,
        complaintRatio,
        status: isSuspicious ? "RED" : "GREEN"
      };
    });

    res.status(200).json(shopStats);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/user-stats', async (req, res) => {
  try {

    const userStats = await Complaint.aggregate([
      {
        $group: {
          _id: "$rationCard",
          totalComplaints: { $sum: 1 },
          validComplaints: {
            $sum: {
              $cond: [{ $gt: ["$differenceKg", 0] }, 1, 0]
            }
          }
        }
      }
    ]);

    const enhancedStats = userStats.map(user => {

      const validityRate =
        user.totalComplaints > 0
          ? user.validComplaints / user.totalComplaints
          : 0;

      // 🔴 NEW USER FRAUD LOGIC
      const isSuspicious =
        user.totalComplaints > 3 &&
        validityRate < 0.5;

      return {
        rationCard: user._id,
        totalComplaints: user.totalComplaints,
        validComplaints: user.validComplaints,
        validityRate,
        status: isSuspicious ? "RED" : "GREEN"
      };
    });

    res.status(200).json(enhancedStats);

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
