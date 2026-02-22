const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const Transaction = require('../models/Transaction');

router.post('/', async (req, res) => {
  try {
    const { rationCard, shopId, receivedKg } = req.body;

    if (!rationCard || !shopId || receivedKg === undefined) {
      return res.status(400).json({
        message: "rationCard, shopId and receivedKg are required"
      });
    }

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    // Find transaction for this month
    const transaction = await Transaction.findOne({
      rationCard,
      timestamp: { $gte: monthStart }
    });

    if (!transaction) {
      return res.status(400).json({
        message: "No distribution found for this month"
      });
    }

    const expectedKg = transaction.quantityGiven;
    const differenceKg = expectedKg - receivedKg;

    const monthString = `${monthStart.getFullYear()}-${String(
      monthStart.getMonth() + 1
    ).padStart(2, '0')}`;

    await Complaint.create({
      rationCard,
      shopId,
      expectedKg,
      receivedKg,
      differenceKg,
      month: monthString
    });

    return res.status(200).json({
      message: "Complaint registered successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});
module.exports = router;