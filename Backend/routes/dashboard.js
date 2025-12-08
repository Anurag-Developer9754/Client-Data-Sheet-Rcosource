import express from "express";
import fs from "fs";
import csv from "csvtojson";

const router = express.Router();

// Amount parsing function
function parseAmount(amount) {
  if (!amount) return 0;
  return Number(amount.replace(/[^0-9.-]+/g, ""));
}

router.get("/", async (req, res) => {
  try {
    const filePath = "uploads/november.csv";

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "CSV file not found" });
    }

    const jsonArray = await csv().fromFile(filePath);

    let totalOrders = 0;
    let totalRevenue = 0;
    const dayWise = {};

    jsonArray.forEach((row) => {
      const type = row["type"]?.trim().toLowerCase();
      const dateRaw = row["date/time"];
      const totalStr = row["total"];

      if (type !== "order") return;

      const date = dateRaw?.split(" ")[0];

      const total = parseAmount(totalStr);

      totalOrders++;
      totalRevenue += total;

      if (!dayWise[date]) {
        dayWise[date] = { orders: 0, revenue: 0 };
      }

      dayWise[date].orders++;
      dayWise[date].revenue += total;
    });

    const graphData = Object.keys(dayWise).map((date) => ({
      month: date,
      orders: dayWise[date].orders,
      revenue: Number(dayWise[date].revenue.toFixed(2)),
    }));

    res.json({
      stats: {
        users: 0,
        orders: totalOrders,
        revenue: Number(totalRevenue.toFixed(2)),
      },
      graph: graphData,
    });

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;