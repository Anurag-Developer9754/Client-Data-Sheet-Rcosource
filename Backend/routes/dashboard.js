const express = require("express");
const router = express.Router();

// Dummy Data – later you will replace with database values
router.get("/", (req, res) => {
  res.json({
    users: 120,
    orders: 85,
    revenue: 2450
  });
});

module.exports = router;
